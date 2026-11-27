<template>
    <div class="absolute right-0 top-0 mt-14 sm:mt-4 mr-4 z-5">
        <dropdown class="items-to-add-dropdown" align="right" ref="add-character"
                  @open="dropDownClose = true"
                  @close="dropDownClose = false">
            <template v-slot:trigger>
                <button type="button"
                        class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 bg-dark-gray2-75! rounded-full transform transition-transform"
                        :class="{'rotate-45': dropDownClose}">
                    add
                </button>
            </template>

            <div class="w-full">
                <h2>{{ $t('Add Character') }}</h2>
                <ul class="flex flex-col py-4 px-3">
                    <template v-for="(unlocked, id) in sheet.characterUnlocks" :key="id">
                        <li v-if="isListed(id) && isUnlocked(id)"
                            class="add-character flow-root"
                            :class="['order-'+sheet.characterOrder[id], sheet.characterOrder[id] == 0 ? 'mt-0' : 'mt-6']">
                            <a @click.stop.prevent="$emit('create', id)" href="#"
                               class="-m-3 p-3 whitespace-nowrap flex items-center rounded-md text-base font-medium text-white hover:bg-black2-75 transition ease-in-out duration-150"
                               :class="{'text-white2-50 grayscale cursor-default': inParty(id)}">
                                <character-icon class="shrink-0 w-5 mr-2"
                                                :class="[!inParty(id) ? 'hover:cursor-pointer': '']"
                                                :character="id"/>
                                <span>{{ $t(characterNames[id]) }}</span>
                            </a>
                        </li>
                    </template>
                </ul>
                <h2 v-if="hasLocked">{{ $t('Locked') }}</h2>
                <ul v-if="hasLocked" class="flex flex-wrap mx-1 py-2">
                    <template v-for="(unlocked, id) in sheet.characterUnlocks" :key="id">
                        <li v-if="isListed(id) && !isUnlocked(id)" class="flow-root"
                            :class="'order-'+sheet.characterOrder[id]">
                            <a @click.stop.prevent="$emit('create', id)" href="#" class="block w-5 m-1">
                                <character-icon class="shrink-0 w-5" :character="id"/>
                            </a>
                        </li>
                    </template>
                </ul>
            </div>
        </dropdown>
    </div>
</template>

<script>
import GameData from "../../../services/GameData";
import CharacterRepository from "../../../repositories/CharacterRepository";
import Sheet from "../../../models/Sheet";
import CampaignSheet from "../../../models/CampaignSheet";

export default {
    emits: ['create'],
    inject: ['appData'],
    props: {
        sheet: Sheet|CampaignSheet
    },
    data() {
        return {
            characterNames: {},
            editionPairs: {},
            dropDownClose: false,
            characterRepository: new CharacterRepository
        }
    },
    computed: {
        hasLocked() {
            return Object.keys(this.sheet.characterUnlocks).some(id => this.isListed(id) && !this.isUnlocked(id));
        }
    },
    mounted() {
        this.render();

        this.$listen('campaigns-changed', this.render);
    },
    methods: {
        render() {
            const characters = this.characterRepository.get(this.appData.game);
            this.characterNames = collect(characters).pluck('translatedName').items;
            this.editionPairs = this.characterRepository.editionPairs();
        },
        // A class in both editions is listed once, as the campaign's edition
        isListed(id) {
            return id in this.sheet.characterOrder && !Object.values(this.editionPairs).includes(id);
        },
        isUnlocked(id) {
            return !!(this.sheet.characterUnlocks[id] || this.sheet.characterUnlocks[this.editionPairs[id]]);
        },
        inParty(id) {
            return [id, this.editionPairs[id]].some(classId => classId && this.characterRepository.partyHasCharacter(this.sheet, classId));
        },
        open() {
            this.$refs['add-character'].open()
        }
    }
}
</script>
