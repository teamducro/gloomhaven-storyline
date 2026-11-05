# CLAUDE.md

Vue 3 (Options API) SPA tracking campaign progress for Gloomhaven (+ Forgotten Circles expansion), Gloomhaven 2nd Edition, Frosthaven, Jaws of the Lion, Crimson Scales and the Mercenary Pack crossover. Offline-first, optional cloud sync via a Laravel backend.

## Domain

Vocabulary: `GLOSSARY.md` (rulebook terms; use them in prose, plans and UI text). How the code models each game: the `gloomhaven-domain` skill.

## Commands

```bash
npm run dev | watch | prod | prod-fh   # build into public/ (watch = vite build --watch, no dev server)
npm test                               # Cypress runner against https://gloomhaven-storyline.test/ (valet link)
npm run lang                           # add missing translation keys to other locales
```
`.env`: set `MIX_WEB_URL`, `MIX_APP_URL`.

Headless tests, CI-style (`.github/workflows/cypress.yml`), works without valet and in worktrees:
```bash
cp .github/.env .env                    # localhost URLs
MIX_CDN_URL= npm run dev                # images from public/img instead of the CDN
npx http-server public -p 8080 --silent # in the background
env -u ELECTRON_RUN_AS_NODE npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/tracker/<spec>.cy.js
```
- `env -u ELECTRON_RUN_AS_NODE`: Electron hosts (T3 Code) export it, and Cypress then fails verify with "bad option: --no-sandbox".
- "Cannot find native binding" (rolldown): `node_modules` predates the Vite migration; run `npm ci`. Missing Cypress binary: `npx cypress install`.

PRs target `develop`.

## Architecture

- No Vuex: global state on root instance `window.app`; event bus `$bus` (`services/EventBus.js` on `globalProperties`); `provide/inject` for `appData.game`, `appData.story`.
- Static game data: one `resources/js/games/{gh,gh2,fh,jotl,cs,fc,mp}.json` per game, all with the same top-level keys, read via `services/GameData.js`. `gh.json` holds the FC scenarios, items and achievements; `fc.json` only FC's own data.
- `ScenarioValidator` unlocks scenarios on every change, up to 5 passes.
- Campaign state: one localStorage blob per campaign (`app.campaignData`, key `app.campaignId`) holding every game; each `Storable` model writes its `fieldsToStore` under its `key()`, and `delete()` writes `null` (a tombstone the server needs). Key layout: `gloomhaven-domain` skill.
- Sync: `Versionable` models carry `version` + md5 `hash`; `StorySyncer` bumps the version of each changed model and PUTs the blob when its hash changes; the server reports per-key conflicts. Realtime via Echo/Pusher.
- Layers: `models/`, `repositories/` (local data + logic), `apiRepositories/` (axios), `services/`, `validators/`, `pages/` (routes), `components/` (auto-registered globally by filename).
- Translations: `resources/js/lang/{locale}/*.js`, 9 locales; `en.js` only re-exports the topic files. Add keys to `lang/en/<topic>.js`, then `npm run lang`.

## Build (Vite, `vite.config.mjs`)

- Runs twice (`BUNDLE=app|website`): `app.js` tracker at `/tracker`, `website.js` marketing site at `/`.
- Vue full build: root templates live in-DOM in `index.html`. Env vars keep the `MIX_` prefix (`import.meta.env.MIX_*`).
- `MIX_MAIN_GAME=gh|fh` picks branding/assets from `resources/public-{game}`.
- Production entries are content-hashed (`js/app-<hash>.js`): lazy chunks import the entry by file name, so a `?v=` query would load the app twice. CSS keeps `?v=`.
- Post-build plugin copies public files, img, svg, fonts, and writes the service worker cache version + precache list (`'build-files'` placeholder).
- vue-i18n 11 in legacy mode (`services/createLegacyI18n.js`) with a lenient compiler: messages contain custom `{TOKEN}` placeholders and literal `|`.

## Debugging

`window.app` (`.story`, `.scenarios`, `.game`); localStorage key = campaign id (`local` or `_<storyId>`).
