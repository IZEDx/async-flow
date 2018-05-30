
import { Pipe, Sink, MaybePromise, Operator } from "../..";

export function map<T, K>(mapFn: (x: T) => MaybePromise<K>): Operator<T, K> 
{
    return Pipe.operator( async (value: T, sink: Sink<K>) => {
        const mapped = mapFn(value);
        return sink.next(mapped instanceof Promise ? await mapped : mapped);
    } );
}
