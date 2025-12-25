import {build} from "tsdown"

await build({entry: ["./src/main.tsx"], format: "esm", dts: true, clean: true})
