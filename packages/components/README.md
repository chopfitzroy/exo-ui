# Components 📦

Stitches components are **0 Markup** components that will help you create more composable user interfaces.

Goals of this library:
- 0 dependencies other than [React](https://react.dev/)
- 0 Markup (this means it can be using with [React Native](https://reactnative.dev/))
- Composable, you should be able to access data without the need to prop drill
- Easily able to be copy/pasted, similar to how [Tailwind](https://tailwindcss.com/) code can be pasted into any project that uses Tailwind, Stitches should be able to be pasted into any project that use Stitches.

### Components

**In progress:**

- [x] MultiSelectList (Accordions, Customisations, etc...)
- [x] SingleSelectList (Carousels, etc...)
- [ ] QuantityList (Shopping cart, etc...)
- [ ] Pagination (Pagination, etc...)
- [ ] Toggle (Modals, Dropdowns, etc...)
- [ ] Timer (Alerts, etc...)

**Considering:**

- [ ] Carousel - This is really just an abstraction over `SingleSelectList` and may not be worth implementing
- [ ] Slider - The implementation for this is not obvious and it will be difficult to create nice ergonomics

The above components can achieve all functionality provided by [Headless UI](https://headlessui.com/) and most of the functionality provided by [Radix UI](https://www.radix-ui.com/).

It is worth noting both of these libraries place a _heavy_ emphasis on Accessibility which is not what Stitches is trying to do, and would technically be impossible seeing as we don't provide any markup.

### Limitations

Part of relying only on React means making use of [Context](https://react.dev/learn/passing-data-deeply-with-context) this in itself is fine but it means developers do need to be aware of some of the limitations.

The most important thing to understand is the use of `Provider` components and that these **must wrap** all child components, **including components that use any hooks that reference that context**.

Stitches does it's best to provide explicit error messages that help to explain if a context issue has occured, that being said if you are unfamiliar with Context I recommend [reading up on it](https://react.dev/learn/passing-data-deeply-with-context).

### Style Guide

Named functions we use the `function` syntax.

Anonymous function we use the arrow (`=>`) syntax.
