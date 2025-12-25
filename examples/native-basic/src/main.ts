import {Internationalization} from "@intee/core"
import {mean, startsWith} from "@intee/core/helpers/match"
import {pick} from "@intee/core/helpers/load"
import en_US from "./languages/en-US"

// Create i18n instance with multiple locales
// First source is fallback (must be sync), others can be async
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

// DOM elements
const output = document.getElementById("output")!
const select = document.getElementById("language") as HTMLSelectElement

// Render function
async function render(languages: string[]) {
	const t = await i18n.resolve(...languages)
	const tag = t[Internationalization.Tag]

	output.innerHTML = `
		<p><strong>Resolved locale:</strong> ${tag}</p>
		<p><strong>hello:</strong> ${t.hello}</p>
		<p><strong>goodbye:</strong> ${t.goodbye}</p>
	`

	// Sync select value with resolved tag
	select.value = tag
}

// Initial render with browser languages
render(navigator.languages as string[])

// Handle language change
select.addEventListener("change", e => {
	const value = (e.target as HTMLSelectElement).value
	render([value])
})
