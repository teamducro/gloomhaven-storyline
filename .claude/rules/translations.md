---
paths:
  - "resources/js/lang/**"
---

# Translations

- Files: `resources/js/lang/{locale}/<topic>.js`; `{locale}.js` only re-exports the topic files. 15 locales, `en` is the source.
- New key: add it to `lang/en/<topic>.js` and, with the English text until translated, at the same place in every other locale.
- Keep `{TOKEN}` placeholders and literal `|` exactly as in English. vue-i18n 11 runs in legacy mode with a lenient compiler (`services/createLegacyI18n.js`) because of them.
- Use the rulebook terms from `GLOSSARY.md`.
