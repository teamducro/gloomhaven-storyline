# CLAUDE.md

Vue 3 (Options API) SPA tracking campaign progress for Gloomhaven (+ Forgotten Circles expansion), Gloomhaven 2nd Edition, Frosthaven, Jaws of the Lion, Crimson Scales and the Mercenary Pack crossover. Offline-first, optional cloud sync via a Laravel backend.

## Domain

Vocabulary: `GLOSSARY.md` (rulebook terms; use them in prose, plans and UI text). How the code models each game: the `gloomhaven-domain` skill.

## Commands

```bash
npm run dev | watch | prod | prod-fh   # build into public/ (watch = vite build --watch, no dev server)
npm test                               # Cypress runner against https://gloomhaven-storyline.test/ (valet link); worktrees: cypress-headless skill
npm run test:arch                      # architecture + game data rules (`cypress/arch.test.js`), no build needed
```
`.env`: set `MIX_WEB_URL`, `MIX_APP_URL`. Env vars keep the `MIX_` prefix (`import.meta.env.MIX_*`).

PRs target `develop`.

## Architecture

- No Vuex: global state on root instance `window.app`; event bus `$bus` (`services/EventBus.js` on `globalProperties`; components subscribe with `this.$listen(event, callback)`, which unsubscribes on unmount); `provide/inject` for `appData.game`, `appData.story`.
- Static game data: one `resources/js/games/{game}.json` per game, read via `services/GameData.js`. `gh.json` holds the FC scenarios, items and achievements; `fc.json` only FC's own data.
- Campaign state: one localStorage blob per campaign (`app.campaignData`, key `app.campaignId`) holding every game; each `Storable` model writes its `fieldsToStore` under its `key()`, and `delete()` writes `null` (a tombstone the server needs). Key layout: `gloomhaven-domain` skill.
- Sync: `Versionable` models carry `version` + md5 `hash`; `StorySyncer` bumps the version of each changed model and PUTs the blob when its hash changes; the server reports per-key conflicts. Realtime via Echo/Pusher.
- Layers: `models/`, `repositories/` (local data + logic), `apiRepositories/` (axios), `services/`, `validators/`, `pages/` (routes), `components/` (auto-registered globally by filename).

## Rules

`.claude/rules/` holds the conventions per area (translations, storable models, icons, components, game data, Cypress specs, build); each loads when you work on its files.

## Debugging

`window.app` (`.story`, `.scenarios`, `.game`); localStorage key = campaign id (`local` or `_<storyId>`).
