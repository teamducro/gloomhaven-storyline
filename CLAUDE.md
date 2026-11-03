# CLAUDE.md

Vue 3 (Options API) SPA tracking campaign progress for Gloomhaven (+ Forgotten Circles expansion), Gloomhaven 2nd Edition (in progress), Frosthaven, Jaws of the Lion, Crimson Scales and the Mercenary Pack crossover. Offline-first, optional cloud sync via a Laravel backend.

## Domain

Vocabulary: `GLOSSARY.md` (rulebook terms; use them in prose, plans and UI text). How the code models each game: the `gloomhaven-domain` skill.

## Commands

```bash
npm run dev | watch | prod | prod-fh   # build into public/ (watch = vite build --watch, no dev server)
npm test                               # Cypress runner; headless: npx cypress run --spec cypress/e2e/tracker/<spec>.cy.js
npm run lang                           # add missing translation keys to other locales
```
Local site `https://gloomhaven-storyline.test/` (valet link). `.env`: set `MIX_WEB_URL`, `MIX_APP_URL`.

## Architecture

- No Vuex: global state on root instance `window.app`; event bus `$bus` (`services/EventBus.js` on `globalProperties`); `provide/inject` for `appData.game`, `appData.story`.
- Static game data in `resources/js/*.json` via `services/GameData.js`; campaign state in localStorage via `Storable` models; `ScenarioValidator` unlocks scenarios on every change; `StorySyncer` syncs to the API (Echo/Pusher realtime).
- Layers: `models/`, `repositories/` (local data + logic), `apiRepositories/` (axios), `services/`, `validators/`, `pages/` (routes), `components/` (auto-registered globally by filename).
- Translations: `lang/{locale}/*.js`, 9 locales; add keys to `lang/en/*.js` (not `en.js`), then `npm run lang`.

## Build (Vite, `vite.config.mjs`)

- Runs twice (`BUNDLE=app|website`): `app.js` tracker at `/tracker`, `website.js` marketing site at `/`.
- Vue full build: root templates live in-DOM in `index.html`. Env vars keep the `MIX_` prefix (`import.meta.env.MIX_*`).
- `MIX_MAIN_GAME=gh|fh` picks branding/assets from `resources/public-{game}`.
- Production entries are content-hashed (`js/app-<hash>.js`): lazy chunks import the entry by file name, so a `?v=` query would load the app twice. CSS keeps `?v=`.
- Post-build plugin copies public files, img, svg, fonts, and writes the service worker cache version + precache list (`'build-files'` placeholder).
- vue-i18n 11 in legacy mode (`services/createLegacyI18n.js`) with a lenient compiler: messages contain custom `{TOKEN}` placeholders and literal `|`.

## Debugging

`window.app` (`.story`, `.scenarios`, `.game`); localStorage key = campaign id (`local` or `_<storyId>`).
