<template>
    <div class="sm:w-30">
        <!-- Mobile menu -->
        <div class="relative sm:hidden pb-2 mb-4 border-b border-white2-25">
            <select id="mobile-character-menu" @change="mobileSelect"
                    class="block w-full absolute opacity-0 font-title text-md -ml-1">
                <option value="party">
                    {{ sheet.game === Game.fh
                        ? $t('Campaign sheet')
                        : $t('Party sheet')
                    }}
                </option>
                <optgroup :label="$t('Characters')">
                    <template v-for="character in orderedCharacters">
                        <option
                            :selected="selected === character.uuid && !abilities"
                            :value="character.uuid">
                            {{
                                character.name === character.characterName
                                    ? $t(character.characterName)
                                    : character.name
                            }}
                        </option>
                        <option
                            :selected="selected === character.uuid && abilities"
                            :value="character.uuid+'|abilities'"
                        >
                            &nbsp;&nbsp;&nbsp;{{ $t('Abilities') }}
                        </option>
                    </template>
                </optgroup>
                <optgroup v-if="!isLocalCampaign && Object.keys(sheet.archivedCharacters).length"
                          :label="$t('Retired')">
                    <option v-for="character in sheet.archivedCharacters"
                            :selected="selected === character.uuid"
                            :value="character.uuid">
                        {{ character.name === character.characterName ? $t(character.characterName) : character.name }}
                    </option>
                </optgroup>
                <option value="items">
                    {{ $t('Items') }}
                </option>
                <option v-if="sheet.game === Game.fh" value="buildings">
                    {{ $t('Buildings') }}
                </option>
            </select>
            <label v-if="selectedCharacter" for="mobile-character-menu" class="flex items-center">
                <character-icon class="flex-shrink-0 w-5 mr-2"
                                :key="'selected-character-icon-'+selectedCharacter.id"
                                :character="selectedCharacter.id"/>
                <span class="font-title">{{
                        selectedCharacter.name === selectedCharacter.characterName ? $t(selectedCharacter.characterName) : selectedCharacter.name
                    }} {{ abilities ? $t('Abilities') : '' }}</span>
                <span class="ml-auto material-icons">keyboard_arrow_down</span>
            </label>
        </div>

        <!-- Desktop menu -->
        <div id="desktop-character-menu" class="hidden sm:block">
            <draggable tag="ul" class="space-y-6 mb-4" v-model="orderedCharacters" group="characters" @end="updateCharacterOrder" :disabled="!appData.hasMouse">
                <li class="space-y-6" v-for="character in orderedCharacters" :key="'character-'+character.uuid">
                    <span class="flow-root">
                        <a @click.stop.prevent="select(character.uuid)" href="#"
                           class="-m-3 p-2 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                           :class="[selected === character.uuid && !abilities ? 'text-white bg-black2-25' : 'text-white2-75']">
                            <character-icon class="flex-shrink-0 w-5 mr-2" :character="character.id"/>
                            <span class="overflow-hidden">{{
                                    character.name === character.characterName
                                        ? $t(character.characterName)
                                        : character.name
                                }}</span>
                        </a>
                    </span>
                    <span v-if="selected === character.uuid" class="flow-root"
                        :key="'character-abilities-'+character.uuid">
                        <a @click.stop.prevent="select(character.uuid, true)" href="#"
                           class="-m-3 p-2 pl-9 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                           :class="[selected === character.uuid && abilities ? 'text-white bg-black2-25' : 'text-white2-75']">
                            <span class="overflow-hidden">{{ $t('Abilities') }}</span>
                        </a>
                    </span>
                </li>
            </draggable>

            <template v-if="!isLocalCampaign && Object.keys(sheet.archivedCharacters).length">
                <collapse :initialOpen="selected in sheet.archivedCharacters">
                    <template slot="trigger">
                        <div class="my-3 font-title">{{ $t('Retired') }}</div>
                    </template>

                    <ul class="space-y-6 mb-4">
                        <li v-for="character in sheet.archivedCharacters"
                            :key="'archived-character-'+character.uuid" class="flow-root">
                            <a @click.stop.prevent="select(character.uuid)" href="#"
                               class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-50 transition ease-in-out duration-150"
                               :class="[selected === character.uuid ? 'text-white bg-black2-25' : 'text-white2-75']">
                                <character-icon class="flex-shrink-0 w-5 mr-2" :character="character.id"/>
                                <span>{{
                                        character.name === character.characterName
                                            ? $t(character.characterName)
                                            : character.name
                                    }}</span>
                            </a>
                        </li>
                    </ul>
                </collapse>
            </template>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {Game} from "../../../models/Game";

export default {
    components: {
        draggable,
    },
    inject: ['appData'],
    props: {
        selected: String,
        abilities: {
            type: Boolean,
            default: false
        },
        sheet: Object,
        isLocalCampaign: Boolean
    },
    mounted() {
        this.orderedCharacters = this.orderCharacters();
    },
    data() {
        return {
            orderedCharacters: []
        }
    },
    computed: {
        Game() {
            return Game
        },
        selectedCharacter() {
            if (!this.selected) {
                return;
            }
            return this.sheet.characters[this.selected] || this.sheet.archivedCharacters[this.selected];
        }
    },
    methods: {
        updateCharacterOrder() {
            // Update the sort order of the characters
            this.orderedCharacters.forEach((character, index) => {
                character.sortOrder = index;
                character.store();
            });

            // Sync the new character order with the server
            this.$emit('store');
        },
        orderCharacters() {
            return Object.values(this.sheet.characters)
                .sort((a,b) => a.sortOrder - b.sortOrder)
        },
        select(uuid, abilities = false) {
            // Already on the selected page
            if (this.selected === uuid && this.abilities === abilities) {
                return;
            }

            if (uuid.length < 36) {
                this.$router.push(uuid);
            } else {
                this.$emit('select', uuid, abilities);
            }
        },
        mobileSelect(e) {
            const valueParts = e.target.value.split('|');
            const uuid = valueParts.shift();
            const abilities = !!(valueParts.shift() || false);

            this.select(uuid, abilities);
        }
    }
}
</script>
