---
paths:
  - "resources/js/components/**"
  - "resources/js/pages/**"
---

# Components and pages

- Options API. Components in `components/` register globally by filename (`CheckboxWithLabel.vue` → `<checkbox-with-label>`); don't import them into other components.
- Bus: `this.$bus.$emit(event, payload)` to send, `this.$listen(event, callback)` to receive. `$listen` unsubscribes on unmount, so no `$off`.
- User-facing text goes through `$t`, with the key in `resources/js/lang` (see the translations rule).
- Logic that `app.js` or a service also needs (settings, storage keys, calculations) lives in `services/`, and the component imports it. Nothing outside `components/` and `pages/` imports a component.
- Check a sibling component for structure before writing a new one; reuse `components/elements/` first.
