/**
 * A predicate function that determines if a locale tag matches a criteria.
 * Returns a number (score) or boolean (match/no match).
 */
export type Predicate = (tag: string) => number | boolean

/**
 * Matches if the locale tag starts with the given prefix.
 * @param prefix The prefix to check for.
 */
export const startsWith =
	(prefix: string): Predicate =>
	(tag: string) =>
		tag.startsWith(prefix)

/**
 * Matches if the locale tag ends with the given suffix.
 * @param suffix The suffix to check for.
 */
export const endsWith =
	(suffix: string): Predicate =>
	(tag: string) =>
		tag.endsWith(suffix)

/**
 * Matches if the locale tag is exactly equal to the given string.
 * @param expected The string to compare against.
 */
export const is =
	(expected: string): Predicate =>
	(tag: string) =>
		expected === tag

/**
 * Matches if the locale tag is one of the provided strings.
 * @param candidates The list of allowed strings.
 */
export const isOneOf =
	(...candidates: string[]): Predicate =>
	(tag: string) =>
		candidates.includes(tag)

/**
 * Matches if the locale tag matches the given regular expression.
 * @param pattern The regular expression to test against.
 */
export const matches = (pattern: RegExp): Predicate => pattern.test.bind(pattern)

/**
 * Applies a weight to the result of another predicate.
 * Useful for prioritizing certain matches over others.
 *
 * @param factor The weight multiplier.
 * @param predicate The predicate to wrap.
 */
export const weighted =
	(factor: number, predicate: Predicate): Predicate =>
	(tag: string) =>
		Number(predicate(tag)) * factor

/**
 * Calculates the mean score of multiple predicates.
 *
 * @param predicates The predicates to average.
 */
export const mean =
	(...predicates: Predicate[]): Predicate =>
	(tag: string) =>
		predicates.reduce((sum, p) => sum + Number(p(tag)), 0) /
		predicates.length
