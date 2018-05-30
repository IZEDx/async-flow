
import { Sink, Valve, Tank, MaybePromise } from ".";

export type Spring<T> = (sink: Sink<T>) => MaybePromise<void>;
export type Operator<T, K = T> = (input: Pipe<T>) => Pipe<K>;


export class Pipe<T> {
    constructor(private _spring: Spring<T>) {
    }

    static pump<T>(ai: AsyncIterable<T>, waitForPromises = false): Pipe<T> {
        return new Pipe<T>(async (sink: Sink<T>) => {
            try {
                for await(const data of ai) {
                    if (sink.plucked) break;
                    const r = sink.next(data);
                    if (waitForPromises && r instanceof Promise) await r;
                }
                sink.return();
            } catch(e) {
                sink.throw(e);
            }
        });
    }

    static operator<T, K>(next: (value: T, sink: Sink<K>) => MaybePromise<void>): Operator<T, K> {
        return input => new Pipe<K>(sink => {
            input.flush(new Sink({
                async next(value: T) {
                    return next(value, sink);
                },
                return: () => sink.return(),
                throw: err => sink.throw(err),
                pluck: () => sink.pluck()
            }))
        });
    }

    pipe<K>(operator: Operator<T, K>): Pipe<K> {
        return operator(this);
    }

    flush(sink: Sink<T>) {
        this._spring(sink);
        return new Valve(sink);
    }

    collect(): AsyncIterable<T> {
        const spring = this._spring;
        return {
            [Symbol.asyncIterator]() {
                const tank = new Tank<T>();
                spring(tank);
                return { next: () => tank.pump() }
            }
        }
    }
}
