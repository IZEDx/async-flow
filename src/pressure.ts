
export namespace Pressure {
    export function immediate<T>(fn: () => T|Promise<T>) {
        return timeout(0, fn);
    }
    
    export function timeout<T>(ms: number, fn: () => T|Promise<T>) {
        return regulate(fn => setTimeout(fn, ms), fn);
    }
    
    export function animationFrame<T>(fn: () => T|Promise<T>) {
        return regulate(fn => requestAnimationFrame(time => fn(time)), fn);
    }
    
    
    export async function regulate<T>(regulator: (fn: Function) => void, fn: () => T|Promise<T>) {
        return new Promise<T>((resolve, reject) => {
            regulator(() => {
                try {
                    const t = fn();
                    if (t instanceof Promise) {
                        t.then(resolve).catch(reject);
                    } else {
                        resolve(t);
                    }
                } catch(err) {
                    reject(err);
                }
            });
        });
    }
}