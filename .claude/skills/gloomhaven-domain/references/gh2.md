# Gloomhaven 2nd Edition (gh2), in progress

A separate game from Gloomhaven, being built on `feature/2nd`. Background, sources and decisions: `docs/GH 2nd/README.md` and `docs/GH 2nd/plans/00-overview.md` … `07-campaign.md`.

## Wiring

- Beta game (`GameData.beta()`): disabled by default in Settings > Games. Covered by the GH licence (`GameData.includedIn()`, API receives `accessGame = 'gh'`).
- Data is generated: `commands/convert-gh2-data.js` (scenarios, achievements, lang), `convert-gh2-characters.js`, `convert-gh2-items.js`, `convert-gh2-cards.js` (`events-gh2.json`), `gh2-map.js` + `gh2-coordinates.json` (approximate map positions), `generate-storyline-svg.js` (`svg/storylines/gh2.svg`). Change the converter and regenerate.
- Specs: `cypress/e2e/tracker/gh2*.cy.js`.

## Campaign sheet (`pages/PartyGh2.vue`, model `Sheet`)

Labelled "Campaign sheet" but stored as a plain `Sheet` (`sheet-gh2`).

- Faction reputation: `sheet.factionReputation` with keys `demons`, `merchant-guild`, `military`, range -10..12 (cap 20 once sheet unlock 17/18/19 is ticked). No party reputation; shop price modifier is 0.
- Reputation thresholds are stored as `Party` achievements `P2RD6/12`, `P2RME6/12`, `P2RMI6/12`, `P2R16`, `P2R20`, auto-gained (gain only) by `PartyGh2`. First faction at 13 ticks sheet unlock 0 and adds City event 57.
- Inspiration (number), imbuement (80 boxes; every 5th = +1 prosperity, every 10th = section), prosperity (thresholds 1/6/13/23/34/46/60/75/90, sections at boxes 13/23/34/46), donations (+1 prosperity per 50 gold, max 20).
- 20 sheet unlocks: index order is persisted, append only.
- Decks: City/Road start 1–20 (max C100 / R77). Unlocking a class adds its class events (`Sheet.classEvents`). Event cards are a front plus 1–4 outcome strips (`events-gh2.json`).

## Scenarios

- Roots 0 (Training Course) and 1. Variants 23A/23B/25A/25B are ids 101–104 with a display `number`.
- Conclusion decisions are data-driven: `prompt: "gh2-<id>"` + `prompt_unlocks[n-1]`.
- `required_by` mixes scenario ints and achievement ids. No regions, pages or story summaries. Solo 201–218 (chapter 100).
- Chapters ≥100: 100 Solo, 101 Personal Quests, 102 Random Side Scenarios, 103 Puzzle Book, 104 Events, 105 Reputation.
- `ScenarioCompletedService` is off.

## Achievements

`achievements-gh2.json`: Global `G2*`, city rule group `CR2` (start `G2AUP` An Uneasy Peace, then `G2CRD` Demons, `G2CRME` Merchants, `G2CRMI` Military). No stacking stickers. `G2TPE` enables enhancements.

## Characters and items

- 18 classes with ids suffixed `2` (`BR2` Bruiser, `SC2` Silent Knife, `ST2` Soultether from Summoner, `WF2` Wildfury from Beast Tyrant). Masteries; perks of `type: "custom"` have no `cards` (text only). GH classes are hidden in a GH2 campaign and vice versa.
- Personal quests 1–22 unlock classes and add class events.
- Shop by prosperity (thresholds over items 1–68, plus 116), item designs 69–170, flip items (`backDesc`).
- Enhancements: GH2 cost table (FH costs without Regenerate), no limit on enhanced cards. Difficulty table adds hazardous terrain.

## Not modelled (deferred in the plans)

Item faction-reputation requirements, personal quest deck gating, "all parents required" multi-parent unlocks, Challenger's Rift, cross-game items, countable achievements.
