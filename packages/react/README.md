# @intee/react

React bindings for @intee/core with TanStack Query integration.

## Features

- React hooks for accessing translations
- Automatic language detection from `navigator.languages`
- Built-in caching via TanStack Query
- Context-based language state management

## Installation

```bash
npm install @intee/core @intee/react @tanstack/react-query
```

## Peer Dependencies

- `@intee/core`
- `@tanstack/react-query` (v5)
- `react` (>=18.0.0)

## Quick Start

```tsx
import { Internationalization } from "@intee/core"
import { startsWith, mean } from "@intee/core/helpers/match"
import { pick } from "@intee/core/helpers/load"
import { InternationalizationReact } from "@intee/react"
import { useContext } from "react"
import en_US from "./languages/en-US"

// Setup core i18n
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

// Create React bindings
const { Provider, useTranslation, context } = new InternationalizationReact(i18n)

function App() {
  return (
    <Provider>
      <Greeting />
    </Provider>
  )
}

function Greeting() {
  const [t] = useTranslation()
  const [, setLanguages, currentTag] = useContext(context)!

  return (
    <div>
      <p>{t.hello}</p>
      <p>{t.goodbye}</p>
      <select
        value={currentTag}
        onChange={e => setLanguages([e.target.value])}>
        <option value="en-US">English</option>
        <option value="zh-CN">中文</option>
      </select>
    </div>
  )
}
```

## API Reference

### `InternationalizationReact`

React bindings wrapping the core `Internationalization` instance.

```typescript
const i18nReact = new InternationalizationReact(i18n)
```

#### Properties

##### `Provider`

React component that wraps your application. Initializes language state from `navigator.languages`.

```tsx
<i18nReact.Provider>
  <App />
</i18nReact.Provider>
```

##### `context`

React context for accessing language state. Value is a tuple:

```typescript
[languages, setLanguages, currentTag]
```

- `languages`: Current language preferences
- `setLanguages`: Function to update languages
- `currentTag`: The resolved locale tag

```tsx
const [languages, setLanguages, currentTag] = useContext(i18nReact.context)!
```

##### `useTranslation(...languages)`

Hook for accessing translations.

```typescript
const [translation, queryState] = useTranslation()
```

Returns a tuple:
- `translation`: The resolved translation object with locale tag
- `queryState`: TanStack Query state (loading, error, etc.)

**Override languages:**

```typescript
// Use specific languages instead of context
const [t] = useTranslation("zh-CN", "en-US")
```

**Access locale tag:**

```typescript
import { Internationalization } from "@intee/core"

const [t] = useTranslation()
console.log(t[Internationalization.Tag]) // "en-US"
```

## License

MIT
