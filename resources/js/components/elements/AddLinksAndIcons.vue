<template>
    <component v-bind:is="render()"></component>
</template>

<script>
import ItemTextParser from "../../services/ItemTextParser";
import ScenarioTextParser from "../../services/ScenarioTextParser";
import ScenarioRepository from "../../repositories/ScenarioRepository";
import Helpers from "../../services/Helpers";
import GameData from "../../services/GameData";

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
            this.itemTextParser.parse(text).each((item, id) => {
                text = text.replace(item, `<a class="link" href="#" @click.prevent="$bus.$emit('open-item', {id:${id}})">${item}</a>`);
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
                        text = text.replace(name, 'Hidden Scenario');
                    }
                }
            });

            return text;
        },
        addCharacterIcons(text) {
            const characters = Object.values(this.gameData.characterOrder(app.game));

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
                    '{Shield}': this.$t('Shield') + ' <webp src="/img/icons/general/shield.png" width="20" class="inline"/>',
                    '{Heal}': this.$t('Heal') + ' <webp src="/img/icons/general/heal.png" width="20" class="inline"/>',
                    '{Attack}': this.$t('Attack') + ' <webp src="/img/icons/general/attack.png" width="20" class="inline"/>',
                    '{Range}': this.$t('Range') + ' <webp src="/img/icons/general/range.png" width="20" class="inline"/>',
                    '{Move}': this.$t('Move') + ' <webp src="/img/icons/general/move.png" width="20" class="inline"/>',
                    '{Jump}': this.$t('Jump') + ' <webp src="/img/icons/general/jump.png" width="20" class="inline"/>',
                    '{Recover}': this.$t('Recover') + ' <webp src="/img/icons/general/recover_white.png" width="20" class="inline"/>',
                    '{Refresh}': this.$t('Refresh') + ' <webp src="/img/icons/general/refresh_white.png" width="20" class="inline"/>',
                    '{Flying}': this.$t('Flying') + ' <webp src="/img/icons/general/flying.png" width="20" class="inline"/>',
                    '{modifier_minus_one}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{-1}': '<webp src="/img/icons/general/modifier_minus_one_white.png" width="20" class="inline"/>',
                    '{any}': '<webp src="/img/icons/elements/any.png" width="20" class="inline"/>',
                    '{use}': '<webp src="/img/icons/elements/use.png" width="20" class="inline"/>',
                    '{dark}': '<webp src="/img/icons/elements/dark.png" width="20" class="inline"/>',
                    '{earth}': '<webp src="/img/icons/elements/earth.png" width="20" class="inline"/>',
                    '{fire}': '<webp src="/img/icons/elements/fire.png" width="20" class="inline"/>',
                    '{ice}': '<webp src="/img/icons/elements/ice.png" width="20" class="inline"/>',
                    '{wind}': '<webp src="/img/icons/elements/wind.png" width="20" class="inline"/>',
                    '{light}': '<webp src="/img/icons/elements/light.png" width="20" class="inline"/>',
                    '{anyX}': '<webp src="/img/icons/elements/anyX.png" width="20" class="inline"/>',
                    '{darkX}': '<webp src="/img/icons/elements/darkX.png" width="20" class="inline"/>',
                    '{earthX}': '<webp src="/img/icons/elements/earthX.png" width="20" class="inline"/>',
                    '{fireX}': '<webp src="/img/icons/elements/fireX.png" width="20" class="inline"/>',
                    '{iceX}': '<webp src="/img/icons/elements/iceX.png" width="20" class="inline"/>',
                    '{windX}': '<webp src="/img/icons/elements/windX.png" width="20" class="inline"/>',
                    '{lightX}': '<webp src="/img/icons/elements/lightX.png" width="20" class="inline"/>',
                    '{multi_attack.cleave_0_1}': '<webp src="/img/icons/aoe/cleave_0_1.png" width="40" class="inline"/>',
                    '{multi_attack.cone_0_1}': '<webp src="/img/icons/aoe/cone_0_1.png" width="40" class="inline"/>',
                    '{multi_attack.cone_1_1}': '<webp src="/img/icons/aoe/cone_1_1.png" width="40" class="inline"/>',
                    '{multi_attack.cube_2_2}': '<webp src="/img/icons/aoe/cube_2_2.png" width="40" class="inline"/>',
                    '{multi_attack.line_0_1_1}': '<webp src="/img/icons/aoe/line_0_1_1.png" width="60" class="inline"/>',
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
                    '{note-115}': '<webp src="/img/notes/note-115.png" width="421"/>',
                    '{note-42}': '<webp src="/img/notes/note-42.png" width="421"/>',
                }).each((icon, key) => {
                    text = text.replaceAll(key, icon);
                });
            }

            return text;
        }
    }
}
</script>
