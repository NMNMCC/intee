import type {Async} from "../util.js"

/**
 * Picks a property from the result of a loader.
 *
 * @param key The key of the property to pick.
 * @param loader The loader to wrap.
 */
export const pick =
	<K extends keyof T, T>(key: K, loader: Async<T>): Async<T[K]> =>
	() =>
		map(loader, t => t[key])()

/**
 * Maps the result of a loader using a transformation function.
 *
 * @param loader The loader to wrap.
 * @param fn The function to transform the result.
 */
export const map =
	<T, U>(loader: Async<T>, fn: (t: T) => U): Async<U> =>
	() =>
		loader().then(fn)

/**
 * Memoizes a loader so it's only executed once.
 *
 * @param loader The loader to memoize.
 */
export const memoize = <T>(loader: Async<T>): Async<T> => {
	let promise: PromiseLike<T> | undefined
	return () => (promise ||= loader())
}
