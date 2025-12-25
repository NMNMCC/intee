import {useContext} from "react"
import en_US from "./languages/en-US"
import {Internationalization} from "@intee/core"
import {mean, startsWith} from "@intee/core/helpers/match"
import {InternationalizationReact} from "@intee/react"
import {pick} from "@intee/core/helpers/load"

const i18n = new Internationalization(
	{
		tag: "en-US",
		predicate: mean(startsWith("en"), startsWith("en-US")),
		loader: () => en_US
	},
	{
		tag: "zh-CN",
		predicate: mean(startsWith("zh"), startsWith("zh-CN")),
		loader: pick("default", () => import("./languages/zh-CN"))
	}
)
const {context, Provider, useTranslation} = new InternationalizationReact(i18n)

export default function App() {
	return (
		<Provider>
			<Greeting />
		</Provider>
	)
}

export function Greeting() {
	const [t] = useTranslation()
	const [, setLanguages, current] = useContext(context)!

	return (
		<>
			<p>hello: {t.hello}</p>
			<p>goodbye: {t.goodbye}</p>
			<div style={{marginTop: "1rem"}}>
				<select
					value={current}
					onChange={e => setLanguages([e.target.value])}>
					<option value="en-US">English</option>
					<option value="zh-CN">中文</option>
				</select>
			</div>
		</>
	)
}
