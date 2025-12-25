import type {Source} from "./resource.js"
import type {Async, Sync} from "./util.js"

/**
 * Unique symbol used to tag translation objects with their locale identifier.
 * This allows type-safe access to the current locale tag at runtime.
 */
export const Tag: unique symbol = Symbol("Internationalization.Tag")

/**
 * Attaches a locale tag to a translation object.
 *
 * @template T The type of the translation object.
 * @template TagValue The literal type of the tag value.
 * @param t The translation object to tag.
 * @param tag The tag value to attach.
 * @returns A new object with the tag attached via the {@link Tag} symbol.
 */
export const tag = <T, TagValue>(t: T, tag: TagValue) =>
	Object.assign({}, t, {[Tag]: tag}) as Tagged<T, TagValue>

/**
 * A translation object with an attached locale tag.
 * The tag is accessible via the {@link Tag} symbol.
 *
 * @template T The type of the translation object.
 * @template TagValue The literal type of the tag value.
 */
export type Tagged<T, TagValue> = T & {[Tag]: TagValue}

/**
 * Implementation of the Internationalization interface.
 * Manages a list of locale sources and selects the best match based on language preferences.
 *
 * @template T The type of the source content.
 * @template Tags The union of all source tag literal types.
 */
export class Internationalization<T, const Tags extends string = string> {
	public static readonly Tag: typeof Tag = Tag
	private readonly sources: [
		Source<Tags, Sync<T>>,
		...Source<Tags, Sync<T> | Async<T>>[]
	]

	/**
	 * Creates a new Internationalization instance.
	 *
	 * @param sources A list of locale sources. The first source is used as a fallback.
	 *                Later sources have higher priority if they match equally well.
	 */
	constructor(
		public readonly fallback: Source<Tags, Sync<T>>,
		...others: Source<Tags, Sync<T> | Async<T>>[]
	) {
		this.sources = [fallback, ...others]
	}

	/**
	 * Resolves the source content for the specified locales.
	 * It iterates through the provided locales and sources to find the best match.
	 *
	 * @param locales A list of preferred locales, in order of preference.
	 * @returns A promise that resolves to the best matching source content.
	 */
	public resolve = async (...locales: string[]): Promise<Tagged<T, Tags>> => {
		let max = 0
		let source: Source<Tags, Sync<T> | Async<T>> = this.fallback
		for (const locale of locales) {
			for (const s of this.sources) {
				const score = Math.abs(Number(s.predicate(locale)))
				if (score > max) {
					max = score
					source = s
				}
			}

			if (max > 0) break
		}

		return tag(await source.loader(), source.tag)
	}
}
