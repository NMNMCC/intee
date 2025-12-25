import {Tag, tag, type Internationalization, type Tagged} from "@intee/core"
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query"
import React, {createContext, useContext, useEffect, useState} from "react"

/**
 * The value type stored in the language context.
 * Contains the current language preferences, a setter function, and the active locale tag.
 *
 * @template Tags The union of all source tag literal types.
 */
type LanguageContextValue<Tags extends string> = [
	languages: string[],
	setLanguages: React.Dispatch<React.SetStateAction<string[]>>,
	currentTag: Tags
]

/**
 * React bindings for the Internationalization class.
 * Provides a context provider and hook for accessing translations in React components.
 *
 * @template T The type of the translation object.
 * @template Tags The union of all source tag literal types.
 *
 * @example
 * ```tsx
 * const i18n = new Internationalization(enUS, zhCN)
 * const i18nReact = new InternationalizationReact(i18n)
 *
 * // In your app root
 * <i18nReact.Provider>
 *   <App />
 * </i18nReact.Provider>
 *
 * // In components
 * const [t] = i18nReact.useTranslation()
 * return <div>{t.greeting}</div>
 * ```
 */
export class InternationalizationReact<T, Tags extends string = string> {
	/**
	 * Creates a new InternationalizationReact instance.
	 *
	 * @param Internationalization The core Internationalization instance to wrap.
	 */
	constructor(
		private readonly Internationalization: Internationalization<T, Tags>
	) {}

	private readonly client = new QueryClient()

	/**
	 * React context for sharing language state across the component tree.
	 * Provides access to current languages, a setter, and the active locale tag.
	 */
	public readonly context = createContext<LanguageContextValue<Tags> | null>(
		null
	)

	/**
	 * Provider component that wraps your application.
	 * Initializes language state from `navigator.languages` and provides
	 * translation context to all child components.
	 *
	 * @example
	 * ```tsx
	 * <i18nReact.Provider>
	 *   <App />
	 * </i18nReact.Provider>
	 * ```
	 */
	public readonly Provider: React.FC<React.PropsWithChildren> = ({
		children
	}) => {
		const [languages, setLanguages] = useState([
			...(navigator?.languages ?? [])
		])
		const [currentTag, setCurrentTag] = useState<Tags>(
			this.Internationalization.fallback.tag
		)

		return (
			<this.context.Provider
				value={[languages, setLanguages, currentTag]}>
				<QueryClientProvider client={this.client}>
					<this.TagUpdater setCurrentTag={setCurrentTag} />
					{children}
				</QueryClientProvider>
			</this.context.Provider>
		)
	}

	/**
	 * Internal component that synchronizes the current locale tag
	 * with the resolved translation.
	 */
	private readonly TagUpdater: React.FC<{
		setCurrentTag: React.Dispatch<React.SetStateAction<Tags>>
	}> = ({setCurrentTag}) => {
		const [t] = this.useTranslation()
		useEffect(() => {
			setCurrentTag(t[Tag])
		}, [t, setCurrentTag])
		return null
	}

	/**
	 * Hook for accessing translations in functional components.
	 * Resolves the best matching translation based on provided languages
	 * and the context's language preferences.
	 *
	 * @param languages Optional list of preferred languages to override context.
	 * @returns A tuple of [translation, queryState] where translation is the
	 *          resolved translation object with its locale tag, and queryState
	 *          contains loading/error information from react-query.
	 *
	 * @example
	 * ```tsx
	 * // Use context languages
	 * const [t] = i18nReact.useTranslation()
	 *
	 * // Override with specific languages
	 * const [t] = i18nReact.useTranslation("zh-CN", "en-US")
	 *
	 * // Access the current locale tag
	 * console.log(t[Internationalization.Tag]) // "zh-CN"
	 * ```
	 */
	public readonly useTranslation = (...languages: string[]) => {
		const ctx = useContext(this.context)
		const merged = [...languages, ...(ctx ? ctx[0] : [])]

		const {data: translation, ...others} = useQuery({
			queryKey: [merged.toString()],
			queryFn: () => this.Internationalization.resolve(...merged),
			staleTime: Infinity
		})

		return [
			(translation ??
				tag(
					this.Internationalization.fallback.loader(),
					this.Internationalization.fallback.tag
				)) as Tagged<T, Tags>,
			others
		] as const
	}
}
