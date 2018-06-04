
import { Pipe, Sink, MaybePromise, Operator, maybeAwait } from "../..";

export function map<T, K>(mapFn: (x: T) => MaybePromise<K>): Operator<T, K> 
{
    return Pipe.operator( async (value: T, sink: Sink<K>) => sink.next( await maybeAwait( mapFn(value))) );
}
