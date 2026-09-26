<template>
    <div>
        <modal ref="modal" :max-width="canEnhance ? '' : '348px'" class="ability-modal">
            <template v-slot:title>
                <span class="capitalize">
                    {{ ability ? $t(ability.name) : '' }}
                </span>
            </template>
            <div v-if="ability" slot="content" class="w-full h-full flex flex-col md:flex-row outline-none">
                <div class="relative w-full" style="max-width: 300px;">
                    <webp :src="ability.image" :alt="$t(ability.name)"
                          class="w-full rounded-lg sm:rounded-xl"/>
                    <enhancement-sticker v-for="enhancement in enhancements" :key="enhancement.id"
                                          :id="enhancement.id" :type="enhancement.type"
                                          :x="enhancement.x" :y="enhancement.y" :editable="true"
                                          @drag="drag" @reposition="reposition"/>
                </div>

                <div v-if="canEnhance" class="md:ml-4 md:mt-0 mb-4 md:w-64 mt-4">
                    <div v-if="enhancements.length" class="mb-4 space-y-1">
                        <div v-for="enhancement in enhancements" :key="enhancement.id"
                             class="flex items-center bg-dark-gray2-75 rounded px-2 py-1">
                            <enhancement-icon :type="enhancement.type" :size="16" class="mr-2"/>
                            <span class="truncate">{{ enhancementDisplayLabel(enhancement.type) }}</span>
                            <span @click="remove(enhancement.id)"
                                  class="ml-auto material-icons cursor-pointer"
                                  :class="{'opacity-25 pointer-events-none': appData.read_only}">clear</span>
                        </div>
                    </div>

                    <button v-if="!enhancing" @click="enhancing = true" type="button"
                            class="mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">{{ $t('Enhance') }}</span>
                    </button>

                    <div v-else class="flex flex-col space-y-2">
                        <label class="flex flex-col">
                            {{ $t('Enhancement') }}
                            <div class="flex items-center gap-2">
                                <enhancement-icon :type="type" :size="20"/>
                                <select id="enhancement-type" v-model="type" class="bg-dark-gray2-75 p-2 rounded flex-1">
                                    <option v-for="option in typeOptions" :value="option">
                                        {{ enhancementDisplayLabel(option) }}
                                    </option>
                                </select>
                            </div>
                        </label>

                        <label class="flex flex-col">
                            {{ $t('Ability property') }}
                            <select v-model="abilityProperty" class="bg-dark-gray2-75 p-2 rounded">
                                <option value="normal">{{ $t('Normal') }}</option>
                                <option value="lost">{{ $t('Lost (no persistent)') }}</option>
                                <option value="persistent">{{ $t('Persistent bonus') }}</option>
                            </select>
                        </label>

                        <checkbox-with-label v-if="canDoubleForMultiTarget" id="enhancement-multi-target"
                                             :label="$t('Targets multiple figures/tiles')"
                                             :auto-disable="false" :checked.sync="multiTarget"/>

                        <label v-if="type === 'attack_hex'" class="flex flex-col">
                            {{ $t('Existing hexes') }}
                            <number-field id="enhancement-hex-count" :value.sync="hexCount" :min="1" :max="20"/>
                        </label>

                        <p>{{ $t('Cost') }}: {{ cost }} {{ $t('gold') }}</p>
                        <p v-if="atEnhancedCardLimit" class="text-red-400">
                            {{ $t('Enhanced card limit reached (prosperity level {level})', {level: maxEnhancedCards(sheet)}) }}
                        </p>

                        <div class="flex flex-wrap gap-2">
                            <button @click="buy" type="button" class="mdc-button mdc-button--raised"
                                    :disabled="appData.read_only || !hasEnoughGold">
                                <add-links-and-icons class="mr-2" :text="'{COINS}'"/>
                                <span class="mdc-button__label">{{ $t('Buy') }}</span>
                            </button>
                            <button @click="addFree" type="button" class="mdc-button mdc-button--raised"
                                    :disabled="appData.read_only">
                                <i class="material-icons mdc-button__icon">add</i>
                                <span class="mdc-button__label">{{ $t('Add') }}</span>
                            </button>
                            <button @click="enhancing = false" type="button" class="mdc-button">
                                <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import StorySyncer from "../../services/StorySyncer";
import AbilityEnhancements from "../../services/AbilityEnhancements";

const noMultiTargetDouble = ['target', 'fire', 'ice', 'air', 'earth', 'light', 'dark', 'wild_element', 'attack_hex'];

export default {
    inject: ['appData'],
    mixins: [AbilityEnhancements],
    data() {
        return {
            ability: null,
            character: null,
            sheet: null,
            enhancing: false,
            type: 'attack',
            abilityProperty: 'normal',
            multiTarget: false,
            hexCount: 1,
            storySyncer: new StorySyncer,
        }
    },
    mounted() {
        this.$bus.$on('open-ability-card', (payload) => {
            this.open(payload);
        });
        this.$bus.$on('close-ability-card', this.close);
    },
    computed: {
        canEnhance() {
            return this.character && this.sheet && !this.appData.read_only
                && this.enhancementsUnlocked(this.sheet);
        },
        typeOptions() {
            return Object.keys(this.enhancementBaseCosts(this.sheet.game));
        },
        canDoubleForMultiTarget() {
            return !noMultiTargetDouble.includes(this.type);
        },
        enhancements() {
            if (!this.sheet.enhancementsEnabled) {
                return [];
            }

            return this.sheet.enhancements[this.character.id]?.[this.ability.code] || [];
        },
        previousCount() {
            return this.enhancements.length;
        },
        cost() {
            return this.calculateEnhancementCost({
                type: this.type,
                level: this.ability.level,
                multiTarget: this.canDoubleForMultiTarget && this.multiTarget,
                abilityProperty: this.abilityProperty,
                previousCount: this.previousCount,
                hexCount: this.hexCount,
            }, this.sheet.game);
        },
        hasEnoughGold() {
            return this.character.gold >= this.cost;
        },
        atEnhancedCardLimit() {
            return this.previousCount === 0
                && this.enhancedCardCount(this.sheet, this.character.id) >= this.maxEnhancedCards(this.sheet);
        }
    },
    methods: {
        async open({ability, character, sheet}) {
            this.ability = ability;
            this.character = character;
            this.sheet = sheet;
            this.enhancing = false;
            this.type = 'attack';
            this.abilityProperty = 'normal';
            this.multiTarget = false;
            this.hexCount = 1;
            this.$refs['modal'].open();
        },
        close() {
            this.ability = null;
            this.$refs['modal'].close();
        },
        drag(id, x, y) {
            const enhancement = this.enhancements.find(e => e.id === id);
            if (enhancement) {
                enhancement.x = x;
                enhancement.y = y;
            }
        },
        reposition() {
            this.sheet.store();
        },
        remove(id) {
            if (this.appData.read_only) {
                return;
            }

            const list = this.enhancements;
            const index = list.findIndex(e => e.id === id);
            if (index !== -1) {
                list.splice(index, 1);
                this.sheet.store();
                this.storySyncer.store();
            }
        },
        buy() {
            if (!this.hasEnoughGold) {
                return;
            }

            this.addEnhancement(true);
        },
        addFree() {
            this.addEnhancement(false);
        },
        addEnhancement(deductGold) {
            if (!this.sheet.enhancements[this.character.id]) {
                Vue.set(this.sheet.enhancements, this.character.id, {});
            }
            if (!this.sheet.enhancements[this.character.id][this.ability.code]) {
                Vue.set(this.sheet.enhancements[this.character.id], this.ability.code, []);
            }

            this.sheet.enhancements[this.character.id][this.ability.code].push({
                id: uuidv4(),
                type: this.type,
                cost: this.cost,
                x: 75,
                y: 10,
            });

            if (deductGold) {
                this.character.gold -= this.cost;
                this.character.store();
            }

            this.sheet.store();
            this.storySyncer.store();

            this.enhancing = false;
        }
    }
}
</script>

<style lang="scss">
.mdc-dialog.ability-modal .mdc-dialog__surface {
    width: auto;
    max-width: fit-content;
}
</style>
