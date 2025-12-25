import {build} from "tsdown"

await build({
	entry: ["./src/index.ts", "./src/helpers/*"],
	format: ["esm"],
	outDir: "dist",
	dts: true
})
