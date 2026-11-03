# Gloomhaven storyline

The spoiler free storyline tracker for Gloomhaven.\
Keep track of your progress of completed and unlocked scenarios!\
https://gloomhaven-storyline.com

## Features

- **Summaries**\
  View a summary of the storyline for each state of a scenario.

  To prevent spoilers we only include a summary up-to the current scenario. The conclusion of a scenario is added after
  it has been completed.
- **Clear and organized**\
  Use the neat Flowchart overview of your completed and unlocked scenarios to keep track of your progress. The scenarios
  are color coded to quickly find available ones.

  Furthermore, it keeps your story organized!
  Blocked scenarios are displayed, along with their requirements. This way, you won't need to read up the requirements
  in the book and risk seeing spoilers.

  When you complete scenarios, you will be granted Party and Global achievements. The app features an achievements
  overview, where all your accomplishments are displayed.
- **Share with party**\
  Share your progress with your party members! Easy with Gloomhaven Storyline!

  You can share your progress manually, or have the app sync it automagically between you and your party members by
  purchasing a license. Only one person in your party needs to purchase a license, and your whole party can benefit!
- **Party Sheet**\
  Gloomhaven storyline tracker features a Party Sheet!

  With it, you can track party-related info like reputation, donations, prosperity and more, all in one place!
- **Character Sheet**\
  Character stats like, perks, xp, gold, equipped items and even ability cards are easily managed in Gloomhaven storyline tracker. 
- **Map view**\
  See all of the scenarios you've played and achievements you've gained, displayed on the original Gloomhaven map!

  All Global achievements and scenarios displayed on the map are clickable and the full functionality of the Flowchart
  view is also available in this Map view.
- **Filters**\
  Gloomhaven Storyline includes the option to track looted chests and a filter feature to find completed scenarios with
  chests you missed.

  Using the filter feature, you can find just the scenario you need to complete your personal quest.
- **Expansions**\
  The tracker has support for Frosthaven, Forgotten Circles, Jaws of the Lion, Crimson Scales and the Mercenary Pack
- **Support for all modern devices**\
  Gloomhaven Storyline supports all modern devices and browsers. Easy to use on your smartphone.
- **Multi language**\
  Gloomhaven Storyline is available in English, French, Italian, German, Spanish, Polish, Russian, Hungarian and
  Portuguese!

  Please contact me if you like to contribute with translations.
- **Virtual Gloomhaven Board**\
  Virtual Gloomhaven Board by Purple Kingdom Games development is designed to help people play Gloomhaven remotely,
  without the need for a physical board. Gloomhaven Storyline features integration with this great tool, allowing you to
  open the virtual board directly from the scenario view.

  Registered users will join the same room as party members automatically!

## Change log

Only somewhat big features are included, every update brings bug fixes and improvements to the app!

[Change log](https://gloomhaven-storyline.com/tracker?change-log#/info)

## Credits

Thanks to these creators for their content.

[Credits](https://gloomhaven-storyline.com/tracker?credits#/info)

## How to build the tracker locally?

The tracker is a Vue 3 app built with [Vite](https://vite.dev). It is a static site: the build writes everything into
`public/`, and any web server that serves that directory will do. There is no Vite dev server. No backend is needed
either; cloud sync is optional and stays off while `MIX_API_URL` is empty.

*Install dependencies*

- Fork the project and clone it.
- Install [node](https://nodejs.org/) 22 (see `.nvmrc`; Vite needs at least 20.19), which includes `npm`.
- Run `npm install` from the project directory.

*Option A: quick start on localhost (no extra tools)*

- Copy `.github/.env` to `.env`. It is preconfigured for `http://localhost:8080`.
- Run `npm run watch` to build into `public/` and rebuild when files change.
- In a second terminal, run `npx http-server public -p 8080 -c-1` (`-c-1` turns off caching so you always get the latest build).
- Visit `http://localhost:8080/tracker`.

*Option B: a local `.test` domain (matches the Cypress default config)*

- Set up [Laravel Valet](https://laravel.com/docs/master/valet) (macOS), then run `valet link && valet secure`.
  On Linux, lerd works too (it reads `.lerd.yaml`). `nginx.lerd.conf` currently hardcodes the maintainer's `root`
  path, so point it at your own `public/` directory first.
- Copy `.env.example` to `.env` and set:
  - `MIX_WEB_URL=https://gloomhaven-storyline.test`
  - `MIX_APP_URL=https://gloomhaven-storyline.test/tracker`
- Run `npm run watch` (or `npm run dev` for a single build).
- Visit `https://gloomhaven-storyline.test/tracker`.

*Builds*

- `npm run watch` rebuilds the tracker and the website on every change; refresh the browser to see it.
- `npm run dev` builds once (unminified, with source maps).
- `npm run production` builds for production (minified, hashed file names), `npm run prod-fh` builds the Frosthaven site.
- `MIX_MAIN_GAME` in `.env` picks the base game of the build (`gh` or `fh`). The other games are selectable inside the app.
- The service worker caches the app; if a change doesn't show up, use a hard reload or unregister it in the browser's dev tools.

## Running the tests

The tests are [Cypress](https://www.cypress.io) end-to-end tests in `cypress/e2e/`. They run against a built, served
copy of the site, so build and start one of the setups above first.

- `npm test` opens the interactive Cypress runner (expects `https://gloomhaven-storyline.test`).
- `npx cypress run --spec cypress/e2e/tracker/storyline.cy.js` runs one spec headless against the `.test` domain.
- To run headless against Option A instead:
  ```bash
  npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/tracker/storyline.cy.js
  ```
  Leave off `--spec` to run every test.

If Cypress reports a missing binary, run `npx cypress install`. Some npm versions skip Cypress's install script.

The same tests run on GitHub Actions for every pull request.

## Translations

English (`resources/js/lang/en/`) is the source of truth. After adding English keys, run `npm run lang` to copy any
missing keys into the other languages, then translate them. The script needs `"type": "module"` temporarily added to
`package.json`; don't commit that change.

## Contributing

Open pull requests against the `develop` branch of
[teamducro/gloomhaven-storyline](https://github.com/teamducro/gloomhaven-storyline), and make sure the Cypress tests
pass.

All content remains under creative commons license BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
