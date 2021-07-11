<template>
    <div v-if="sheet" class="pt-12 pb-4 px-4 md:px-8">
        <div id="characters" class="relative bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Characters')"
            />
            <h1 class="mt-4 text-xl">{{ campaignName }}
                <span v-if="character"
                      class="pl-4">{{ character.characterName }}</span>
            </h1>

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
                    <div class="w-1/2">
                        <div v-if="!selected" @click.stop="() => {$refs['add-character'].open()}"
                             class="absolute z-1 top-0 right-0 bottom-0 left-0 cursor-pointer">
                        </div>

                        <div class="mb-4">
                            <h2 class="mb-2">Name</h2>
                            <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="name-field">
                                <span class="mdc-text-field__ripple"></span>
                                <input class="mdc-text-field__input" aria-labelledby="name"
                                       type="text" name="name" v-model="character.name" @change="store">
                                <span class="mdc-floating-label" id="name">{{ $t('Name') }}</span>
                                <span class="mdc-line-ripple"></span>
                            </label>
                        </div>

                        <div class="flex">
                            <div class="mb-8 sm:mb-0 sm:mr-4">
                                <div class="mb-2 flex items-center">
                                    <h2>{{ $t('Level') }}</h2>
                                    <rollback v-show="!loading" ref="reputation-rollback"
                                              :value.sync="character.level"></rollback>
                                </div>
                                <number-field :value.sync="character.level" :min="1" :max="9" :id="'level'"
                                              @change="store"></number-field>
                            </div>
                            <div class="mb-8 sm:mb-0 sm:mr-4">
                                <div class="mb-2 flex items-center">
                                    <h2>{{ $t('EXP') }}</h2>
                                    <rollback v-show="!loading" ref="reputation-rollback"
                                              :value.sync="character.exp"></rollback>
                                </div>
                                <number-field :value.sync="character.exp" :min="0" :max="9999" :id="'exp'"
                                              @change="store"></number-field>
                            </div>
                            <div class="mb-8 sm:mb-0">
                                <div class="mb-2 flex items-center">
                                    <h2>{{ $t('Gold') }}</h2>
                                    <rollback v-show="!loading" ref="reputation-rollback"
                                              :value.sync="character.gold"></rollback>
                                </div>
                                <number-field :value.sync="character.gold" :min="0" :max="9999" :id="'gold'"
                                              @change="store"></number-field>
                            </div>
                        </div>

                        <div class="flex mb-4 items-center">
                            <div class="bg-black2-50 h-1 w-full rounded-full relative">
                                <div class="absolute left-0 top-0 rounded-full bg-primary h-1 w-1/2"></div>
                            </div>
                            <div class="ml-2 flex flex-col whitespace-no-wrap text-center">
                                <span>Lvl 2</span>
                                <span>45 exp</span>
                            </div>
                        </div>

                        <selectable-list
                            id="items"
                            :title="$t('Items')"
                            :label="$t('Add items')"
                            :items.sync="sheetItems"
                            width="w-auto"
                            @change="storeItems"
                            ref="items"
                        >
                            <span class="flex items-center mr-6" slot="label" slot-scope="{item}">
                                <webp :src="items[item].slot" width="20" class="mr-2"/>
                                <span>{{ items[item].number }} {{ items[item].name }}</span>
                            </span>
                            <div slot="item" slot-scope="{item}"
                                 class="cursor-pointer flex items-center border-b border-white2-50 py-1"
                                 @click="openItemModel(item)">
                                <webp :src="items[item].slot" width="20" class="mr-2"/>
                                <span>{{ items[item].number }} {{ items[item].name }}</span>
                                <span @click.stop="$refs.items.deselect(item)"
                                      class="ml-auto material-icons">clear</span>
                            </div>
                        </selectable-list>

                        <div class="mt-4">
                            <button @click="$refs['remove-character'].open()" type="button"
                                    class="mt-4 mb-6 mdc-button mdc-button--raised">
                                <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                                <span class="mdc-button__label">{{ $t('Remove') }} {{ character.name }}</span>
                            </button>
                        </div>
                    </div>
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
import {MDCTextField} from "@material/textfield/component";
import ItemRepository from "../repositories/ItemRepository";

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
            sheetItems: {},
            items: collect(),
            characterNames: {},
            characterOrder: {},
            nameField: null,
            gameData: new GameData,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            characterRepository: new CharacterRepository,
            itemRepository: new ItemRepository
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

            this.nameField = new MDCTextField(this.$refs['name-field']);
        },
        refreshItems() {
            if (this.character) {
                let sheetItems = this.calculateItems(this.sheet.itemDesigns, this.sheet.prosperityIndex);
                this.sheetItems = {};

                this.items = this.itemRepository.findMany(sheetItems).keyBy('id').items;
                sheetItems.forEach(id => {
                    this.sheetItems[id] = !!this.character.items[id];
                });
            }
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
                this.refreshItems();
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
        openItemModel(id) {
            this.$bus.$emit('open-item', {id: id});
        },
        storeItems() {
            this.character.items = this.sheetItems;
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
