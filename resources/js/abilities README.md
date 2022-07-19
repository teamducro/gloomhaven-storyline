### abilities-cs.json
To convert Abilities data from **worldhaven** to **Storyline**

1. Download `character-ability-cards.js` from worldhaven: https://github.com/any2cards/worldhaven/blob/master/data/character-ability-cards.js
2. Execute the below Find and Replace actions using RegEx

| Find | Replace |
| --- | --- |
| ^\s*"(points|xws)":.*\n               | **delete**          |
| "expansion": "Crimson Scales",        | "game": "cs",       |
| ^(\s*)"image": "character-ability-cards/.*/(.*)/(.*)\.png",   | $1"character_id": "$2",   |
| "initiative":\s"0?(\d*)"              | "initiative": $1    |
| "level":\s"0?(\d*)"                   | "level": $1         |
| "level":\s"(P|M)"                     | "level": 0.1        |
| "level":\s"X"                         | "level": 1.5        |
| "cardno":\s"(\w{2}-)?(\d{1,4})"       | "id": "cs-$1$2"     |

Pay special attention to `level`.

| Case      | Value |
| ---       | :-: |
| level = x | 1.5 |
| Certain characters have "auxilary" cards, such as SB or HP. These show up as "P" or "M" | 0.1 |


### abilities.js

1. Copy the cards from `abilities-cs.json`

| Find | Replace |
| --- | --- |
| ^\s*"(game|char|level|init|id).*\n    | **delete**    |
| ",                                    | "             |
| \{\n(\s*"name": "([\w\-']*)\s?([\w\-']*)?\s?([\w\-']*)?\s?([\w\-']*)?")                  | "$2-$3-$4-$5": {\n$1     |
| -{1,5}":                              | **delete**    |
| ^\s*\{$\n                             | **delete**    |