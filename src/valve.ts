import { Sink } from ".";

export class Valve<T> {
    private _closed = false;
    get closed() { return this._closed; }
    
    constructor(private _sink: Sink<T>) {
    }

    close() {
        if (!this._closed) {
            this._closed = true;
            this._sink.pluck();
        }
    }
}