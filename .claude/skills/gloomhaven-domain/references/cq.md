# ConQuests 2025 promo pack (cq), crossover pack

Never the current game, like [mp](mp.md). Off by default unless a character in the campaign holds a ConQuests card (`GameData.enabledByDefault`), toggled under Settings > Games (Smaller expansions).

- `personalQuests` in `games/cq.json`: 4 cards, string ids `cq01`–`cq04`, shown as "ConQuests 01" (`PersonalQuest.number`). Text in `lang/en/personal_quests.js` under `cq-cq01`…; images in `resources/img/cards/cq/quest/`.
- `PersonalQuestRepository.unlockedQuests` adds them to the pool of `GameData.conquestsGames()` (gh, fc, gh2, fh) while the pack is enabled and prosperity ≥ `required_prosperity` (5). GH2's Draw includes them, like GH.
- A held card stores `game: "cq"`, so it still loads when the pack is turned off. Rewards are display-only (envelope of choice).
