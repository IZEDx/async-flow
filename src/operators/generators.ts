
import { MaybePromise } from ".."

export async function* from<T>(it: Iterable<MaybePromise<T>>): AsyncIterable<T> {
    for (const v of it) {
        yield v instanceof Promise ? await v : v;
    }
}
