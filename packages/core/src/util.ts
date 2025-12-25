/**
 * A deferred computation that returns a promise resolving to a value.
 * Used for lazy loading of locale sources.
 *
 * @template T The type of the value.
 */
export type Async<T> = () => PromiseLike<T>

/**
 * A deferred computation that returns a value synchronously.
 * Used for locale sources that are available immediately.
 *
 * @template T The type of the value.
 */
export type Sync<T> = () => T
