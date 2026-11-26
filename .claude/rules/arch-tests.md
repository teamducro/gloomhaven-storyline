---
paths:
  - "resources/js/**"
  - "cypress/arch.test.js"
  - "resources/sass/_fonts.scss"
---

# Architecture tests

When a change or plan is fully implemented (once, before reporting it done; not after each file edit), run `npm run test:arch`. It takes under a second and needs no build.

A failure means the change breaks a project rule; fix the code, not the test:
- Persisted format (`storage` snapshot): a removed or renamed stored field loses existing campaigns. Keep reading the old format or migrate it, then update the snapshot. A new field only needs adding to the snapshot.
- Layering: logic that `services`, `models`, `repositories` or `validators` need lives there, and components import it, never the reverse.
- Bus: subscribe with `this.$listen(event, callback)`; every event needs both an emitter and a listener.
- Game data: fix the reference in `resources/js/games/{game}.json`.
- Translations: a `$t` key missing from `lang/en`, or a locale whose keys, `{TOKEN}`s or `|` count differ from English. Add the key in English to every locale (see the translations rule).
- Icons: add the icon to the font subset (see the icons rule).
- Components: file names are unique, because they register globally by name; use them without importing.
