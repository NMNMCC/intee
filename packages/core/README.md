# @intee/core

Core internationalization library with type-safe translations and lazy loading support.

## Features

- Type-safe translations with full TypeScript support
- Predicate-based locale matching with scoring system
- Lazy loading via dynamic imports
- Minimal footprint, no heavy dependencies

## Installation

```bash
npm install @intee/core
```

## Quick Start

### Define translations

```typescript
// languages/en-US.ts
export default {
  hello: "Hello!",
  goodbye: "Goodbye!"
}
```

```typescript
// languages/zh-CN.ts
export default {
  hello: "你好！",
  goodbye: "再见！"
} satisfies typeof import("./en-US").default
```

### Setup i18n

```typescript
import { Internationalization } from "@intee/core"
import { startsWith, mean } from "@intee/core/helpers/match"
import { pick } from "@intee/core/helpers/load"
import en_US from "./languages/en-US"

const i18n = new Internationalization(
  // Fallback (must be synchronous)
  {
    tag: "en-US",
    predicate: mean(startsWith("en"), startsWith("en-US")),
    loader: () => en_US
  },
  // Additional locales (can be async)
  {
    tag: "zh-CN",
    predicate: mean(startsWith("zh"), startsWith("zh-CN")),
    loader: pick("default", () => import("./languages/zh-CN"))
  }
)

// Resolve best matching translation
const t = await i18n.resolve("zh-CN", "en-US")
console.log(t.hello) // "你好！"
console.log(t[Internationalization.Tag]) // "zh-CN"
```

## API Reference

### `Internationalization`

Main class for managing locales and resolving translations.

```typescript
new Internationalization(fallback, ...others)
```

- `fallback`: The fallback source (must be synchronous)
- `others`: Additional sources (can be async)

#### Methods

##### `resolve(...locales): Promise<Tagged<T, Tags>>`

Resolves the best matching translation based on locale preferences.

```typescript
const t = await i18n.resolve("zh-CN", "en-US")
```

#### Static Properties

##### `Internationalization.Tag`

Symbol for accessing the locale tag on a resolved translation.

```typescript
const t = await i18n.resolve("zh-CN")
console.log(t[Internationalization.Tag]) // "zh-CN"
```

### `Source`

A locale source interface:

```typescript
interface Source<Tag, Loader> {
  tag: Tag              // Locale identifier (e.g., "en-US")
  predicate: Predicate  // Function to score locale match
  loader: Loader        // Function returning translations
}
```

## Match Helpers

Import from `@intee/core/helpers/match`:

### `startsWith(prefix)`

Matches if locale starts with prefix.

```typescript
startsWith("en")("en-US") // true
startsWith("en")("zh-CN") // false
```

### `endsWith(suffix)`

Matches if locale ends with suffix.

```typescript
endsWith("US")("en-US") // true
```

### `is(expected)`

Exact match.

```typescript
is("en-US")("en-US") // true
is("en-US")("en")    // false
```

### `isOneOf(...candidates)`

Matches any of the candidates.

```typescript
isOneOf("en-US", "en-GB")("en-US") // true
```

### `matches(regex)`

Matches against a regular expression.

```typescript
matches(/^en/)("en-US") // true
```

### `weighted(factor, predicate)`

Applies weight to predicate score.

```typescript
weighted(2, startsWith("en"))("en-US") // 2
```

### `mean(...predicates)`

Averages scores of multiple predicates.

```typescript
mean(startsWith("en"), is("en-US"))("en-US") // 1
mean(startsWith("en"), is("en-US"))("en-GB") // 0.5
```

## Load Helpers

Import from `@intee/core/helpers/load`:

### `pick(key, loader)`

Picks a property from async result.

```typescript
pick("default", () => import("./zh-CN"))
```

### `map(loader, fn)`

Transforms async result.

```typescript
map(() => import("./zh-CN"), m => m.default)
```

### `memoize(loader)`

Caches async result (only executes once).

```typescript
memoize(() => import("./zh-CN"))
```

## License

MIT
