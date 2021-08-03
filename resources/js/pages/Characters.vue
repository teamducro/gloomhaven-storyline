<template>
    <div v-if="sheet" :key="sheetHash" class="pt-12 pb-4 px-4 md:px-8">
        <div id="characters" class="relative bg-black2-25 p-4 rounded-lg m-auto mt-4 max-w-party">

            <tabs class="hidden sm:block"
                  :tabs="[$t('Party sheet'), $t('Characters'), $t('Items')]"
                  :icons="['assignment', 'person', 'style']"
                  :urls="['party', 'characters', 'items']"
                  :active="$t('Characters')"
            />
            <h1 class="hidden sm:inline-block mt-4 text-xl">{{ campaignName }}
                <span v-if="character && selected"
                      class="pl-4">{{ character.characterName }}</span>
            </h1>

            <add-character ref="add-character" :sheet="sheet" @create="create"/>

            <div class="sm:mt-4 sm:flex">
                <character-menu :selected="selected" :sheet="sheet" :user="user" @select="select"/>

                <div v-if="character" class="w-full relative sm:ml-8"
                     :class="{'opacity-25': !selected}">
                    <div class="flex flex-col sheet-break-lg:flex-row sheet-break-lg:space-x-4">
                        <div class="w-full sheet-break-lg:w-1/2">
                            <div v-if="!selected" @click.stop="() => {$refs['add-character'].open()}"
                                 class="absolute z-1 top-0 right-0 bottom-0 left-0 cursor-pointer">
                            </div>

                            <div class="mb-4">
                                <h2 class="mb-2">{{ $t('Name') }}</h2>
                                <label class="flex-1 mdc-text-field mdc-text-field--filled" ref="name-field">
                                    <span class="mdc-text-field__ripple"></span>
                                    <input class="mdc-text-field__input" aria-labelledby="name"
                                           type="text" name="name" v-model="character.name" @change="store">
                                    <span class="mdc-floating-label" id="name">{{ $t('Name') }}</span>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="flex flex-wrap">
                                <div class="mb-4 mr-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('Level') }}</h2>
                                        <rollback v-show="!loading" ref="reputation-rollback"
                                                  :value.sync="character.level"></rollback>
                                    </div>
                                    <number-field class="w-14" :value.sync="character.level" :min="1" :max="9"
                                                  id="level"
                                                  @change="store"></number-field>
                                </div>
                                <div class="mb-4 mr-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('XP') }}</h2>
                                        <rollback v-show="!loading" ref="reputation-rollback"
                                                  :value.sync="character.xp"></rollback>
                                    </div>
                                    <number-field :value.sync="character.xp" :min="0" :max="9999" id="xp"
                                                  @change="store"></number-field>
                                </div>
                                <div class="mb-4">
                                    <div class="mb-2 flex items-center">
                                        <h2>{{ $t('Gold') }}</h2>
                                        <rollback v-show="!loading" ref="reputation-rollback"
                                                  :value.sync="character.gold"></rollback>
                                    </div>
                                    <number-field :value.sync="character.gold" :min="0" :max="9999" id="gold"
                                                  @change="store"></number-field>
                                </div>

                                <level-progress-bar :level="character.level" :xp="character.xp"/>
                            </div>

                            <selectable-list
                                id="items"
                                :title="$t('Items')"
                                :label="$t('Add items')"
                                :items.sync="sheetItems"
                                width="w-auto"
                                class="mb-8"
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

                        </div>
                        <div class="w-full sheet-break-lg:w-1/2">
                            <perks :checks.sync="character.checks" :perks.sync="character.perks"
                                   :character="character" @change="store"/>
                        </div>
                    </div>

                    <div class="my-8">
                        <button v-if="!isArchived" @click="$refs['retire-character'].open()" type="button"
                                class="mr-4 mdc-button mdc-button--raised">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                            <span class="mdc-button__label">{{ $t('Retire') }}</span>
                        </button>
                        <button v-if="isArchived" @click="$refs['remove-character'].open()" type="button"
                                class="mdc-button mdc-button--raised">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">delete_forever</i>
                            <span class="mdc-button__label">{{ $t('Remove') }}</span>
                        </button>
                        <button v-if="isArchived" type="button"
                                @click="restore"
                                :disabled="characterRepository.partyHasCharacter(sheet, character.id)"
                                class="ml-4 mdc-button mdc-button--raised">
                            <i class="material-icons mdc-button__icon" aria-hidden="true">replay</i>
                            <span class="mdc-button__label">{{ $t('Restore') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <modal v-if="character" :title="$t('Retire') + ' ' + character.name"
               ref="retire-character">
            <template v-slot:content>
                <p v-if="user">{{ $t('retire-character.text') }}</p>
                <p v-else>{{ $t('retire-character.upgrade') }},
                    <router-link to="/campaigns" class="link">
                        {{ $t('please consider purchasing a licence') }}.
                    </router-link>
                </p>
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                    <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                </button>
                <button v-if="user" type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="archive">
                    <span class="mdc-button__label text-red-700">{{ $t('Retire') }}</span>
                </button>
                <button v-else type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes"
                        @click="remove">
                    <span class="mdc-button__label text-red-700">{{ $t('Remove') }}</span>
                </button>
            </template>
        </modal>
        <modal v-if="character" :title="$t('Remove') + ' ' + character.name"
               ref="remove-character">
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
import SheetRepository from "../repositories/SheetRepository";
import Character from "../models/Character";
import CharacterRepository from "../repositories/CharacterRepository";
import {MDCTextField} from "@material/textfield/component";
import ItemRepository from "../repositories/ItemRepository";

export default {
    mixins: [GetCampaignName, SheetCalculations],
    data() {
        return {
            user: null,
            sheet: null,
            sheetHash: null,
            selected: null,
            character: null,
            campaignName: null,
            loading: true,
            sheetItems: {},
            items: collect(),
            nameField: null,
            storySyncer: new StorySyncer,
            sheetRepository: new SheetRepository,
            characterRepository: new CharacterRepository,
            itemRepository: new ItemRepository
        }
    },
    watch: {},
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    computed: {
        isArchived() {
            // Reference sheet hash so the value is recalculated when the sheet is updated.
            this.sheetHash;
            return this.selected in this.sheet.archivedCharacters;
        }
    },
    methods: {
        async render() {
            this.loading = true;

            this.user = app.user;
            this.sheet = this.sheetRepository.make(app.game);
            this.campaignName = this.getCampaignName();

            this.selectDefault();

            await this.$nextTick();

            this.loading = false;
        },
        async refreshInputFields() {
            await this.$nextTick();

            if (this.nameField) {
                this.nameField.destroy();
            }
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
            } else if (Object.keys(this.sheet.archivedCharacters).length) {
                this.select(Object.keys(this.sheet.archivedCharacters)[0]);
            } else {
                this.selectDemo();
            }
        },
        select(uuid) {
            if (this.sheet.characters[uuid]) {
                this.character = this.sheet.characters[uuid];
            } else if (this.sheet.archivedCharacters[uuid]) {
                this.character = this.sheet.archivedCharacters[uuid];
            }

            if (this.character) {
                this.selected = uuid;
                this.refreshItems();
                this.rerender();
            }
        },
        selectDemo() {
            this.selected = null;
            this.character = Character.make('demo', app.game, 'BR');
            this.rerender();
        },
        create(id) {
            if (this.characterRepository.partyHasCharacter(this.sheet, id)) {
                return;
            }

            this.sheet.characterUnlocks[id] = true;
            const character = this.characterRepository.createCharacter(this.sheet, id);
            this.select(character.uuid);
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
            if (this.character) {
                this.characterRepository.removeCharacter(this.sheet, this.character);
                this.storySyncer.store();
                this.selectDefault();
            }
        },
        archive() {
            if (this.character) {
                this.characterRepository.archiveCharacter(this.sheet, this.character);
                this.storySyncer.store();
                this.rerender();
            }
        },
        restore() {
            if (this.character) {
                this.characterRepository.restoreCharacter(this.sheet, this.character);
                this.storySyncer.store();
                this.rerender();
            }
        },
        renderHtml(html) {
            return {
                template: `<span>${html}</span>`
            };
        },
        rerender() {
            this.refreshInputFields();
            this.sheetHash = this.sheet.getHash();
        }
    }
}
</script>
