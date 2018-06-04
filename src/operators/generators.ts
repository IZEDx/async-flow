
import { MaybePromise, maybeAwait } from ".."

export async function* from<T>(it: Iterable<MaybePromise<T>>): AsyncIterable<T> {
    for (const v of it) {
        yield await maybeAwait(v);
    }
}
