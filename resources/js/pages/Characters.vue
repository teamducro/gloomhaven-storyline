<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="characters" class="relative bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Characters')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}</h1>

            <div class="absolute right-0 top-0 mt-14 sm:mt-4 mr-4 z-5">
                <dropdown class="items-to-add-dropdown" align="right" ref="add-character"
                          @open="dropDownClose = true"
                          @close="dropDownClose = false">
                    <template v-slot:trigger>
                        <button type="button"
                                class="mdc-icon-button mdc-button--raised material-icons p-2 mr-2 mt-2 i-bg-black2-50 rounded-full transform transition-transform"
                                :class="{'rotate-45': dropDownClose}">
                            add
                        </button>
                    </template>

                    <div class="w-full">
                        <h2>{{ $t('Add Character') }}</h2>
                        <ul class="flex flex-col py-5 px-3 space-y-6">
                            <li v-for="(unlocked, id) in sheet.characterUnlocks" :key="id" class="flow-root"
                                :class="['order-'+characterOrder[id]]">
                                <a @click.stop.prevent="create(id)" href="#"
                                   class="-m-3 p-3 flex items-center rounded-md text-base font-medium text-white hover:bg-black2-75 transition ease-in-out duration-150"
                                   :class="{'text-white2-50 grayscale cursor-default': sheet.characters[id]}">
                                    <character-icon class="w-5 mr-2" :character="id"/>
                                    <span v-if="unlocked">{{ characterNames[id] }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </dropdown>
            </div>

            <div class="mt-4 flex">
                <div class="w-40">
                    <ul class="space-y-6">
                        <li v-for="character in sheet.characters" :key="character.id" class="flow-root">
                            <a @click.stop.prevent="select(character.id)" href="#"
                               class="-m-3 p-3 flex items-center rounded-md text-base font-medium hover:bg-black2-75 transition ease-in-out duration-150"
                               :class="{'text-white': selected === character.id, 'text-white2-75': selected !== character.id}">
                                <character-icon class="w-5 mr-2" :character="character.id"/>
                                <span>{{ character.name }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-if="character" class="ml-8 w-full relative" :class="{'opacity-50': !selected}">
                    <div v-if="!selected" @click.stop="() => {$refs['add-character'].open()}"
                         class="absolute z-1 top-0 right-0 bottom-0 left-0 cursor-pointer">
                    </div>

                    <div>
                        {{ character.name }}
                    </div>

                    <button @click="$refs['remove-character'].open()" type="button"
                            class="mt-4 mb-6 mdc-button mdc-button--raised">
                        <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                        <span class="mdc-button__label">{{ $t('Remove') }} {{ character.name }}</span>
                    </button>
                </div>
            </div>
        </div>

        <modal ref="remove-character" :title="$t('Remove') + ' ' + character.name">
            <template v-slot:content>
                <p>{{ $t('remove-character.text') }}</p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="remove">
                    <span class="mdc-button__label text-red-700">{{ $t('Remove') }}</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import StorySyncer from "../services/StorySyncer";
import GetCampaignName from "../services/GetCampaignName";
import SheetCalculations from "../services/SheetCalculations";
import CharacterIcon from "../components/elements/CharacterIcon";
import Dropdown from "../components/elements/Dropdown";
import GameData from "../services/GameData";
import SheetRepository from "../repositories/SheetRepository";
import Helpers from "../services/Helpers";
import Character from "../models/Character";
import CharacterRepository from "../repositories/CharacterRepository";

export default {
    components: {Dropdown, CharacterIcon},
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            sheet: null,
            selected: null,
            character: null,
            campaignName: null,
            loading: true,
            renderX: 0,
            dropDownClose: false,
            characterNames: {},
            characterOrder: {},
            gameData: new GameData,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            characterRepository: new CharacterRepository
        }
    },
    watch: {},
    mounted() {
        this.render();
        this.characterNames = this.gameData.characterNames(app.game);

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        async render() {
            this.loading = true;

            this.sheet = this.sheetRepository.make(app.game);
            this.campaignName = this.getCampaignName();
            this.characterOrder = Helpers.reverse(this.gameData.characterOrder(app.game));

            this.selectDefault();

            await this.$nextTick();

            this.loading = false;
        },
        selectDefault() {
            if (Object.keys(this.sheet.characters).length) {
                this.select(Object.keys(this.sheet.characters)[0]);
            } else {
                this.selectDemo();
            }
        },
        select(id) {
            if (this.sheet.characters[id]) {
                this.selected = id;
                this.character = this.sheet.characters[id];
            }
        },
        selectDemo() {
            this.selected = null;
            this.character = Character.make('BR', app.game);
        },
        create(id) {
            if (this.sheet.characters[id]) {
                return;
            }

            this.sheet.characterUnlocks[id] = true;
            this.characterRepository.createCharacter(this.sheet, id);
            this.select(id);
            this.store();
        },
        store() {
            if (this.loading) {
                return;
            }

            this.character.store();
            this.storySyncer.store();
        },
        remove() {
            if (this.character && this.sheet.characters[this.character.id]) {
                delete this.sheet.characters[this.character.id];
                this.sheet.store();
                this.storySyncer.store();
                this.selectDefault();
            }
        },
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        },
        rerenderX() {
            this.renderX++;
        }
    }
}
</script>
