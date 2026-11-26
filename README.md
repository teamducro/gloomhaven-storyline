# Gloomhaven storyline

The spoiler-free campaign tracker for the Gloomhaven family of games.\
Keep track of your completed and unlocked scenarios, your party, characters, items and more!\
https://gloomhaven-storyline.com

## Supported games

- **Gloomhaven** with the **Forgotten Circles** expansion
- **Gloomhaven 2nd Edition**
- **Frosthaven**
- **Jaws of the Lion**
- **Crimson Scales**
- Crossover content, played inside any of the games above: the **Mercenary Pack**, **ConQuests 2025** personal
  quests and the **Seeker of Xorn** bonus content

Items can be used across games, so characters can bring their gear along.

## Features

- **Spoiler-free storyline**\
  An interactive flowchart of your campaign. Scenarios are color coded so available ones are easy to find, and blocked
  scenarios show their requirements, so you never need to read ahead in the book.
- **Story summaries**\
  Read a recap of the story so far. Summaries only go up to your current progress; a scenario's conclusion is added once
  you complete it.
- **Scenario details**\
  Per scenario: the monsters you'll face, the official FAQ, scenario level and difficulty, treasures, Boat/Sled/Rope
  requirements and the rewards it grants. Party and Global achievements are awarded automatically on completion.
- **Map view**\
  Your progress on the game's world map, with scenario stickers, achievements and, for Frosthaven, buildings. Everything
  is clickable.
- **Party and campaign sheets**\
  Reputation, prosperity, donations, morale, Town Guard perks, the Frosthaven calendar, buildings, alchemy chart and
  more, all in one place.
- **Character sheets**\
  Level, XP, gold, perks, personal quests, equipped items, attack modifier decks and ability cards, including
  enhancement tracking.
- **Item database**\
  Browse the items available to your party and buy and sell them from a character sheet.
- **Event decks**\
  Draw city, road and rift events, or Frosthaven's summer/winter road, outpost and boat events, straight from the
  tracker.
- **Filters**\
  Track looted chests and find completed scenarios with treasure you missed, or the scenario you need for your personal
  quest.
- **Share with your party**\
  Share your campaign with a link, including a read-only option. With a license your party stays synced in real time;
  only one party member needs to buy one. Snapshots let you roll back changes.
- **Backup and restore**\
  Campaigns without an account live in your browser; save a backup link and paste it to restore the campaign later,
  on any device.
- **Gloomhaven Secretariat export**\
  Export your campaign to Gloomhaven Secretariat to continue at the table.
- **Virtual Gloomhaven Board**\
  Open a scenario in Purple Kingdom Games' Virtual Gloomhaven Board directly from the scenario view. Registered users
  join the same room as their party members automatically.
- **Installable and offline**\
  The tracker is a Progressive Web App: install it on your phone or desktop and use it without a connection.
- **Multi language**\
  Available in English, French, Italian, German, Spanish, Polish, Russian, Hungarian, Portuguese, Brazilian Portuguese,
  Czech, Korean, Thai, Simplified Chinese and Traditional Chinese.

  Please contact me if you would like to contribute translations.

## Change log

Only somewhat big features are included, every update brings bug fixes and improvements to the app!

[Change log](https://gloomhaven-storyline.com/tracker?change-log#/info)

## Credits

Thanks to these creators for their content.

[Credits](https://gloomhaven-storyline.com/tracker?credits#/info)

## How to build the tracker locally?

Install [node](https://nodejs.org/) version 22 (Vite needs at least 20.19), the installation will include `npm`.

*Quick start (no Valet)*

- Fork the project and clone it
- run `npm install`
- run `cp .github/.env .env` (the CI config, pointing at `http://localhost:8080`)
- run `npm run watch` to build into `public/` and rebuild on every change
- in a second terminal, run `npx http-server public -p 8080`

Visit the tracker on `http://localhost:8080/tracker`.

*Setup with Laravel Valet* (feel free to use something else like mamp for a local webserver)

- Install [Laravel Valet](https://laravel.com/docs/master/valet)
- Navigate to project directory
- run `valet link`
- run `valet secure`
- copy `.env.example` to `.env`
- set the `MIX_WEB_URL` to your local website, for example: `MIX_WEB_URL=https://gloomhaven-storyline.test`
- set `MIX_APP_URL` to the same domain and append `/tracker`, for example: `MIX_APP_URL=https://gloomhaven-storyline.test/tracker`
- run `npm install` from the project directory to install dependencies.
- run `npm run dev` to compile project files and assets to the `public` directory.

If everything is working correctly you can visit the tracker locally on: `https://gloomhaven-storyline.test/tracker`

*Setup with Lerd*

`.lerd.yaml` serves `public/` through nginx (`Containerfile.lerd`). `nginx.lerd.conf` has the project path hardcoded
(`root /Users/daniel/Documents/Projects/gloomhaven-storyline/public;`); change it to your own checkout.

*Development*

The project is a Vue 3 app built with [Vite](https://vite.dev). There is no dev server: Vite builds into `public`, which Valet or http-server serves.

- `npm run watch` rebuilds the tracker and the website on every change; refresh the browser to see it.
- `npm run dev` builds once (unminified, with source maps).
- `npm run production` builds for production (minified, hashed file names), `npm run prod-fh` builds the Frosthaven site.
- Images load from the CDN; set `MIX_CDN_URL=` (empty) to load them from `public/img`.
- The service worker caches the app; if a change doesn't show up, use a hard reload or unregister it in the browser's dev tools.

*Translations*

Translations live in `resources/js/lang/{locale}/`, one file per topic; `en.js` only combines them.

- Add new keys to the English topic file, e.g. `resources/js/lang/en/scenarios.js`.
- Add the same keys (in English) to the other locales, then translate them there.

*Tests*

End-to-end tests use [Cypress](https://www.cypress.io).

- `npm test` opens the Cypress runner against `https://gloomhaven-storyline.test` (Valet), so build first.
- Headless against localhost, like CI: with `http-server` running on port 8080 (see quick start), run
  `npx cypress run --config baseUrl=http://localhost:8080 --spec cypress/e2e/tracker/storyline.cy.js`.
- If Cypress complains that its binary is missing, run `npx cypress install`.

*Releasing*

- Bump `version` in `package.json` to the release tag (`npm version <x.y.z> --no-git-tag-version`): the tracker sends it to the API as `X-Client-Version` and tags Sentry events with it.

After changes are made, open a Pull Request into the develop branch for review. 

All content remains under creative commons license BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/)
