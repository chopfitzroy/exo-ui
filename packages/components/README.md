# Components 📦

Exo UI components are **0 Markup** workflow components that will help you create more composable user interfaces.

Stop thinking about state and focus on data! 🎉

Goals of this library:
- 0 Markup (this means it can be using with [React Native](https://reactnative.dev/))
- Composable, you should be able to access data without the need to prop drill
- Easily able to be copy/pasted, similar to how [Tailwind](https://tailwindcss.com/) code can be pasted into any project that uses Tailwind, Exo UI code should be able to be pasted into any project that has Exo UI as a dependency.

### Components

Simple components have no dependencies other than [React](https://react.dev/). Complex components have other dependencies specified.

**Simple:**

- [x] SingleSelectList (Accordions, etc...)
- [x] MultiSelectList (Filters, etc...)
- [x] Pagination (Pagination, etc...)
- [ ] Carousel - Would include functions like next/previous as well as an optional rotation time
- [ ] Toggle (Modals, Dropdowns, etc...)
- [ ] Queue (Alerts, etc...)

**Complex:**

- [ ] Finite State (Multi step form, product tour, etc...) - Requires [`@xstate/fsm`](https://xstate.js.org/docs/packages/xstate-fsm/) (minimal implmentation with less features)
- [ ] Matches (Text search, etc...) - Requires [`oramasearch/orama`](https://docs.oramasearch.com/)

**Considering:**

- [ ] Text validation - Something like email validation is a good example, would likely require 3rd party dependencies, most likely [Zod](https://zod.dev/)
- [ ] Text masking - Something like date or financial formatting is a good example, would likely require 3rd party dependencies
- [ ] Range (slider) - The implementation for this is not obvious and it will be difficult to create nice ergonomics
- [ ] Progress (stepper, loading, rating, etc...) - This would need to be really diverse in order to be useful

Exo UI is not the same as [Headless UI](https://headlessui.com/) or [Radix UI](https://www.radix-ui.com/) as it is not responsible for any markup and instead focuses solely on UI state.

Theorethically Radix UI and Exo UI should pair quite nicely and we would eventually like to create some documentation surrounding how to achieve this.

### Limitations

Part of relying only on React means making use of [Context](https://react.dev/learn/passing-data-deeply-with-context) this in itself is fine but it means developers do need to be aware of some of the limitations.

The most important thing to understand is the use of `Provider` components and that these **must wrap** all child components, **including components that use any hooks that reference that context**.

Exo UI does it's best to provide explicit error messages that help to explain if a context issue has occured, that being said if you are unfamiliar with Context I recommend [reading up on it](https://react.dev/learn/passing-data-deeply-with-context).

### Style Guide

Named functions we use the `function` syntax.

Anonymous function we use the arrow (`=>`) syntax.
