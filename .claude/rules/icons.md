---
paths:
  - "resources/sass/_fonts.scss"
  - "resources/js/**/*.vue"
  - "resources/public-*/**/*.html"
---

# Material icons

The icon font (`resources/fonts/MaterialSymbols.woff2`) only contains the icons listed in `icon_names` in `resources/sass/_fonts.scss`. An icon missing from it renders as its name, e.g. "UNDO".

Before using a `material-icons` name, check that list. If it's missing, reuse a listed icon, or:
1. Add the name, alphabetically, to `icon_names` in the URL in `_fonts.scss`.
2. Open that URL with a Chrome user agent and save the woff2 it points to over `resources/fonts/MaterialSymbols.woff2`.
