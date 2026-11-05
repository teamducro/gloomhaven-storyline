# Frosthaven (fh)

The only game with its own sheet model (`models/CampaignSheet.js`, key `campaign-fh`; `SheetRepository.make('fh')`) and the only game with buildings. Party page: `pages/PartyFh.vue`; buildings: `pages/Buildings.vue`.

## Data (`games/fh.json`)

Top-level `scenarios` (0–137 + solo 201–217), `chapters` (1–6 story; 107 Personal Quests, 108 Puzzle Book, 109 Random Scenarios, 110 Other, 111 Job Postings), `overlays`, `buildings`. Also `achievements`, `items`, `quests` (story summaries), `personalQuests`, `abilities`, `alchemy`, `townGuard`.

Scenario extras: `complexity`, `loot` (coins, materials, herbs, `random-item-treasure`), `prompt` (named conclusion decisions handled in `ChoiceService`, e.g. `startingMorale`, `finalNegotiation`), free-text `requirements`. `required_by` tokens `boat`/`sled`/`rope` (Climbing Gear) check workshop vehicles; `calendar` and `puzzle` are ticked by hand (`Requirement.manuallyUnlock`).

## Campaign sheet

- Calendar: `calendar.week` = passed weeks (80), `calendar.sections` = sections to read per week, seeded from `rules` (`calendarSections`) for new campaigns, then added/removed by hand. Weeks 1–10 summer, 11–20 winter, repeating (`CampaignSheet.isSummer`). Nothing triggers automatically.
- Morale 0–20 → defense (`SheetCalculations.calculateDefense`); walls add 5 each; `totalDefense` is a separate manual counter.
- Resources: `sheet.resources` and `character.resources` (lumber, metal, hide, six herbs). Soldiers, inspiration: counters.
- Prosperity thresholds 1/7/16/28/43/61/82/106/133.
- Town guard: `sheet.checks` (45 checkmarks, groups of 3), `sheet.perks` from `townGuard`, deck from `AttackModifierRepository.getTownGuardModifiers`.
- Event decks: `summerOutpost`, `summerRoad`, `winterOutpost`, `winterRoad`, `boat` (shown only when the Boat exists). Draw picks a random card in the deck; card types in `models/Card.js`.
- Alchemy (`AlchemySection.vue`): brewing sets `sheet.itemDesigns` and `sheet.recipes`; 2 herbs from Alchemist level 1, 3 from level 3.

## Buildings

- `models/Building.js`, `BuildingRepository`, states in `BuildingState.js`: locked, available, built, damaged, wrecked. Data flag `unlocked: true` = starts available, `built: true` = starts at level 1. `levels[0]` is the unbuilt placeholder.
- Per level: `upgrade_cost` = `[prosperity, lumber, metal, hide, gold, morale loss]`, `damage_cost`, `wrecked_cost` = `[lumber, metal, hide]`. Cost `[1,0,0,0,0,0]` means upgraded by other means (`lockedUpgrade`).
- Building text comes from `lang/*/buildings.js` (`fh-<id>.levels.<n>.*`); text inside the JSON is unused.
- `damaged` exists in `BuildingState` but no UI sets it.
- UI `BuildingsSection.vue`: build, upgrade, downgrade, wreck, rebuild. Costs are checked against combined sheet + character resources; they are shown, not deducted. `BuildingModal.vue` sidebars: Alchemist (35), Enhancer (44).
- Shop from building levels (`calculateItemsFh`): Craftsman 34 (items 1–50), Trading Post 37 (120–155), Jeweler 39 (156–167), Stables 88 (247); start 1–10 and 120–128. Trading Post / Enhancer levels seed GH cross-game items.
- Enhancer 44: built or damaged enables enhancements; its level discounts costs (`AbilityEnhancements.js`).

## Map stickers (`models/Overlay.js`, `OverlayRepository`)

A Boat (player names it), B Sled, C Climbing Gear (Workshop vehicles, built from Workshop 84); D–H town features; J–N walls (+5 defense); W–Z world-map stickers added when their `linked_from` scenario completes. Adding/removing re-runs `ScenarioValidator`.

## Achievements

Campaign achievements (`Campaign` type), groups `JAR` and `CORE`, stacking chains `CBT`→`CBT5`, `CCCS`→`CCCS6`. Manual ones list the event `cards` that grant them. No city rule; the Global/Party lists are hidden.

## Characters

17 classes (6 starters), masteries, perks, retirement counter. Personal quests unlock **buildings** (`building_unlocks: [first, fallback]`, result `quest.unlockedBuilding`) and can be gated by `required_building_level`. Solo scenarios 201–217. Items can be crafted (`resources` cost: materials, herbs, other items) via `BuyItem.vue`.

## Planned only (`plans/frosthaven-*.md`, `plans/issue-170-*`, `plans/issue-246-*`)

Garden, pets, carpenter discount, Hall of Revelry, Town Hall, wrecked effects, event deck bottom-of-deck, event choice history.
