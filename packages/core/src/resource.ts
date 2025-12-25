import type {Predicate} from "./helpers/match.js"
import type {Async, Sync} from "./util.js"

/**
 * Represents a localizable source.
 * Contains a predicate for matching and a loader for loading the content.
 *
 * @template Tag The type of the locale tag.
 * @template Loader The type of the loader function.
 */
export interface Source<
	Tag extends string,
	Loader extends Sync<any> | Async<any>
> {
	tag: Tag
	/**
	 * The predicate to determine if this source matches a requested locale.
	 */
	predicate: Predicate
	/**
	 * The loader that retrieves the source content.
	 */
	loader: Loader
}
