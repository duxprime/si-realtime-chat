
interface ArgsCtor<T, Args extends any[]>{
    new (...args: Args): T;
}

interface NoArgsCtor<T> {
    new (): T;
}

/**
 * Represents a class or class function that can be called with the `new` operator.
 */
export type Ctor<T = unknown, Args extends any[] = any[]> = NoArgsCtor<T> | ArgsCtor<T, Args>;