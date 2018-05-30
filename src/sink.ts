import { MaybePromise } from ".";

export interface ISink<T> {
    next(value: T): MaybePromise<void>;
    throw?(error: Error): MaybePromise<void>;
    return?(): MaybePromise<void>;
}

export class Sink<T> implements ISink<T> {
    private _plucked = false;
    private _completed = false;

    get plucked() { return this._plucked; }
    get completed() { return this._completed; }
    
    constructor(private sink: ISink<T>) {
    }

    next(value: T): MaybePromise<void> {
        if (!this._completed && !this._plucked) {
            return this.sink.next(value);
        }
    }

    return(): MaybePromise<void> {
        this._completed = true;
        if (this.sink.return && !this._plucked) {
            return this.sink.return();
        }
    }

    throw(error: Error): MaybePromise<void> {
        if (this.sink.throw && !this._plucked && !this._completed) {
            return this.sink.throw(error);
        }
    }

    pluck() {
        this._plucked = true;
    }
}
