---
paths:
  - "vite.config.mjs"
  - "resources/js/service-worker.js"
  - "resources/js/app.js"
  - "resources/js/website.js"
  - "resources/public-*/**"
---

# Build (Vite, `vite.config.mjs`)

- Runs twice (`BUNDLE=app|website`): `app.js` tracker at `/tracker`, `website.js` marketing site at `/`.
- Vue full build: root templates live in-DOM in `index.html`.
- `MIX_MAIN_GAME=gh|fh` picks branding/assets from `resources/public-{game}`.
- Production entries are content-hashed (`js/app-<hash>.js`): lazy chunks import the entry by file name, so a `?v=` query would load the app twice. CSS keeps `?v=`.
- Post-build plugin copies public files, img, svg, fonts, and writes the service worker cache version + precache list (`'build-files'` placeholder).
