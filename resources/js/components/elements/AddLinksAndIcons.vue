<template>
    <component v-bind:is="render()"></component>
</template>

<script>
import ItemTextParser from "../../services/ItemTextParser";
import ScenarioTextParser from "../../services/ScenarioTextParser";
import ScenarioRepository from "../../repositories/ScenarioRepository";
import Helpers from "../../services/Helpers";
import GameData from "../../services/GameData";
import ItemRepository from "../../repositories/ItemRepository";

export default {
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            itemTextParser: new ItemTextParser,
            scenarioTextParser: new ScenarioTextParser,
            itemRepository: new ItemRepository,
            scenarioRepository: new ScenarioRepository,
            gameData: new GameData,
            scenarios: {}
        }
    },
    methods: {
        render() {
            let output = Helpers.nl2br(this.text);
            output = this.addItemLinks(output);
            output = this.addScenarioLinks(output);
            output = this.addCharacterIcons(output);
            output = this.addIcons(output);
            const scenarios = this.scenarios;

            return {
                data() {
                    return {
                        scenarios
                    }
                },
                template: `<span>${output}</span>`
            };
        },
        addItemLinks(text) {
            this.itemTextParser.parse(text).each((itemText, id) => {
                let item = this.itemRepository.find(id);
                let linkContent = itemText.replace(`“${item._name}”`, `“${item.name}”`);
                text = text.replace(itemText, `<a class="link" href="#" @click.prevent="$bus.$emit('open-item', {id:${id}})">${linkContent}</a>`);
            });

            return text;
        },
        addScenarioLinks(text) {
            this.scenarioTextParser.parse(text).each((name, id) => {
                const scenario = this.scenarioRepository.find(id);
                if (scenario) {
                    if (scenario.isVisible()) {
                        this.scenarios[id] = scenario;
                        text = text.replace(name, `<scenario-number :scenario="scenarios[${id}]"/>`);
                    } else {
                        text = text.replace(name, this.$t('Hidden Scenario'));
                    }
                }
            });

            return text;
        },
        addCharacterIcons(text) {
            const characters = this.gameData.characterOrder(app.game);

            if (text.match(new RegExp(characters.join('|'))) !== null) {
                characters.forEach((character) => {
                    text = text.replace(`{${character}}`, `<character-icon class="w-6 -ml-1 -mb-2 inline-block" character="${character}" />`);
                });
            }

            return text;
        },
        addIcons(text) {
            if (text.includes('{')) {
                collect({
                    '{SHIELD}': this.$t('Shield') + ' <webp src="/img/icons/general/shield.png" width="20" class="inline"/>',
                    '{HEAL}': this.$t('Heal') + ' <webp src="/img/icons/general/heal.png" width="20" class="inline"/>',
                    '{ATTACK}': this.$t('Attack') + ' <webp src="/img/icons/general/attack.png" width="20" class="inline"/>',
                    '{RANGE}': this.$t('Range') + ' <webp src="/img/icons/general/range.png" width="20" class="inline"/>',
                    '{MOVE}': this.$t('Move') + ' <webp src="/img/icons/general/move.png" width="20" class="inline"/>',
                    '{JUMP}': this.$t('Jump') + ' <webp src="/img/icons/general/jump.png" width="20" class="inline"/>',
                    '{RECOVER}': this.$t('Recover') + ' <webp src="/img/icons/general/recover_white.png" width="20" class="inline"/>',
                    '{REFRESH}': this.$t('Refresh') + ' <webp src="/img/icons/general/refresh_white.png" width="20" class="inline"/>',
                    '{FLYING}': this.$t('Flying') + ' <webp src="/img/icons/general/flying.png" width="20" class="inline"/>',
                    '{MODIFIER_MINUS_ONE}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{-1}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{ANY}': '<webp src="/img/icons/elements/any.png" width="20" class="inline"/>',
                    '{USE}': '<webp src="/img/icons/elements/use.png" width="20" class="inline"/>',
                    '{DARK}': '<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{EARTH}': '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{FIRE}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>',
                    '{FIRE_LIGHT}': '<webp src="/img/icons/elements/fire_light.png" width="40" class="inline"/>',
                    '{ICE}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>',
                    '{WIND}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{LIGHT}': '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                    '{ANY_X}': '<webp src="/img/icons/elements/anyX.png" width="20" class="inline"/>',
                    '{DARK_X}': '<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                    '{EARTH_X}': '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                    '{FIRE_X}': '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>',
                    '{ICE_X}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>',
                    '{WIND_X}': '<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                    '{LIGHT_X}': '<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                    '{AOE.CLEAVE_0_1}': '<webp src="/img/icons/aoe/cleave_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_0_1}': '<webp src="/img/icons/aoe/cone_0_1.png" width="40" class="inline"/>',
                    '{AOE.CONE_1_1}': '<webp src="/img/icons/aoe/cone_1_1.png" width="40" class="inline"/>',
                    '{AOE.CUBE_2_2}': '<webp src="/img/icons/aoe/cube_2_2.png" width="40" class="inline"/>',
                    '{AOE.LINE_0_1_1}': '<webp src="/img/icons/aoe/line_0_1_1.png" width="60" class="inline"/>',
                    '{STRENGTHEN}': this.$t('STRENGTHEN') + ' <webp src="/img/icons/status/strengthen.png" width="20" class="inline"/>',
                    '{PUSH}': this.$t('PUSH') + ' <webp src="/img/icons/status/push.png" width="20" class="inline"/>',
                    '{PULL}': this.$t('PULL') + ' <webp src="/img/icons/status/pull.png" width="20" class="inline"/>',
                    '{IMMOBILIZE}': this.$t('IMMOBILIZE') + ' <webp src="/img/icons/status/immobilize.png" width="20" class="inline"/>',
                    '{INVISIBLE}': this.$t('INVISIBLE') + ' <webp src="/img/icons/status/invisible.png" width="20" class="inline"/>',
                    '{PIERCE}': this.$t('PIERCE') + ' <webp src="/img/icons/status/pierce.png" width="20" class="inline"/>',
                    '{STUN}': this.$t('STUN') + ' <webp src="/img/icons/status/stun.png" width="20" class="inline"/>',
                    '{POISON}': this.$t('POISON') + ' <webp src="/img/icons/status/poison.png" width="20" class="inline"/>',
                    '{WOUND}': this.$t('WOUND') + ' <webp src="/img/icons/status/wound.png" width="20" class="inline"/>',
                    '{MUDDLE}': this.$t('MUDDLE') + ' <webp src="/img/icons/status/muddle.png" width="20" class="inline"/>',
                    '{CURSE}': this.$t('CURSE') + ' <webp src="/img/icons/status/curse.png" width="20" class="inline"/>',
                    '{BLESS}': this.$t('BLESS') + ' <webp src="/img/icons/status/bless.png" width="20" class="inline"/>',
                    '{REGENERATE}': this.$t('REGENERATE') + ' <webp src="/img/icons/status/regenerate.png" width="20" class="inline"/>',
                    '{DISARM}': this.$t('DISARM') + ' <webp src="/img/icons/status/disarm.png" width="20" class="inline"/>',
                    '{TARGET}': this.$t('TARGET') + ' <webp src="/img/icons/status/target.png" width="20" class="inline"/>',
                    '{-2_WHITE}': '<webp src="/img/icons/perks/-2_white.png" width="20" class="inline"/>',
                    '{-1_WHITE}': '<webp src="/img/icons/perks/-1_white.png" width="20" class="inline"/>',
                    '{+0_WHITE}': '<webp src="/img/icons/perks/+0_white.png" width="20" class="inline"/>',
                    '{+1_WHITE}': '<webp src="/img/icons/perks/+1_white.png" width="20" class="inline"/>',
                    '{+2_WHITE}': '<webp src="/img/icons/perks/+2_white.png" width="20" class="inline"/>',
                    '{+3_WHITE}': '<webp src="/img/icons/perks/+3_white.png" width="20" class="inline"/>',
                    '{+4_WHITE}': '<webp src="/img/icons/perks/+4_white.png" width="20" class="inline"/>',
                    '{2X_WHITE}': '<webp src="/img/icons/perks/2x_white.png" width="20" class="inline"/>',
                    '{AGAIN}': '<webp src="/img/icons/perks/again_white.png" width="20" class="inline"/>',
                    '{NOTE_115}': '<webp src="/img/notes/note-115.png" width="421"/>',
                    '{NOTE_42}': '<webp src="/img/notes/note-42.png" width="421"/>',
                }).each((icon, key) => {
                    text = text.replaceAll(key, icon);
                });
            }

            return text;
        }
    }
}
</script>
