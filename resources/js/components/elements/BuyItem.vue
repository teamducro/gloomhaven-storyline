<template>
    <div>
        <p class="py-4">
            {{ $t('Availability') }}: {{ availability }} / {{ item.count }}
        </p>
        <div v-if="character">
            <div class="relative pb-2 mb-4 border-b border-white2-25">
                <select id="character-select" name="character-select" v-model="selected"
                        class="block w-full bg-transparent absolute opacity-0 text-md -ml-1">
                    <option v-for="character in characters.items" :selected="selected === character.uuid"
                            :value="character.uuid">
                        {{ character.name }}
                    </option>
                </select>
                <label for="character-select" class="flex items-center">
                    <character-icon :key="character.uuid" class="w-6 mr-2 inline-block"
                                    :character="character.id"/>
                    <span>{{ character.name }}</span>
                    <span class="ml-auto material-icons">keyboard_arrow_down</span>
                </label>
            </div>

            <div class="flex">
                <button v-if="!owns" class="mdc-button mdc-button--raised mr-2"
                        :disabled="appData.read_only || !hasEnoughCash || !availability" @click="buy">
                    <i class="material-icons mdc-button__icon">euro</i>
                    <span class="mdc-button__label">{{ $t('Buy') }}</span>
                </button>
                <button v-if="!owns" class="mdc-button mdc-button--raised mr-2"
                        :disabled="appData.read_only || !availability" @click="add">
                    <i class="material-icons mdc-button__icon">add</i>
                    <span class="mdc-button__label">{{ $t('Add') }}</span>
                </button>
                <button v-if="owns" class="mdc-button mdc-button--raised mr-2" :disabled="appData.read_only"
                        @click="sell">
                    <i class="material-icons mdc-button__icon">local_offer</i>
                    <span class="mdc-button__label">{{ $t('Sell') }}</span>
                </button>
                <button v-if="owns" class="mdc-button mdc-button--raised mr-2" :disabled="appData.read_only"
                        @click="remove">
                    <i class="material-icons mdc-button__icon">remove</i>
                    <span class="mdc-button__label">{{ $t('Remove') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Item from "../../models/Item";
import store from "store/dist/store.modern";
import StorySyncer from "../../services/StorySyncer";
import SheetCalculations from "../../services/SheetCalculations";
import SheetRepository from "../../repositories/SheetRepository";

export default {
    inject: ['appData'],
    mixins: [SheetCalculations],
    props: {
        item: {
            type: Item,
            required: true
        }
    },
    data() {
        return {
            selected: null,
            storedUuid: null,
            characters: collect({}),
            costModifier: 0,
            sheetRepository: new SheetRepository(),
            storySyncer: new StorySyncer,
        }
    },
    mounted() {
        this.getCharacters();
        this.setUuidToBuy();
    },
    computed: {
        character() {
            if (this.selected && this.characters.has(this.selected)) {
                return this.characters.get(this.selected)
            }

            return null;
        },
        availability() {
            return this.item.count - this.characters
                .filter((character) => {
                    return character.items[this.item.id] === true;
                }).count()
        },
        owns() {
            return this.character?.items[this.item.id]
        },
        hasEnoughCash() {
            return this.character.gold >= this.cost;
        },
        cost() {
            return this.item.cost + this.costModifier;
        },
        sellPrice() {
            return Math.floor(this.item.cost / 2);
        }
    },
    methods: {
        buy() {
            if (this.hasEnoughCash) {
                this.character.gold -= this.cost;
                this.add();
            }
        },
        sell() {
            this.character.gold = (this.character.gold || 0) + this.sellPrice;
            this.remove();
        },
        add() {
            if (this.availability) {
                this.character.items[this.item.id] = true;
                this.store();
            }
        },
        remove() {
            this.character.items[this.item.id] = false;
            this.store();
        },
        setUuidToBuy() {
            this.storedUuid = this.readSelected();
            if (this.storedUuid && this.characters.has(this.storedUuid)) {
                this.selected = this.storedUuid;
            } else if (this.characters.count()) {
                this.selected = this.characters.first().uuid;
            }
        },
        refresh() {
            this.getCharacters();
            if (!this.selected || !this.characters.has(this.selected) || this.storedUuid !== this.readSelected()) {
                this.setUuidToBuy();
            }
        },
        getCharacters() {
            const sheet = this.sheetRepository.make(app.game);
            this.characters = collect(sheet.characters);
            this.costModifier = this.calculateCostModifier(sheet.reputation);
        },
        store() {
            this.character.store();
            this.storySyncer.store();

            // Make sure changes are reflected in other components
            this.getCharacters();
            this.$emit('change');
            this.$bus.$emit('campaigns-changed');
        },
        readSelected() {
            return store.get('selectedCharacter');
        },
    }
}
</script>
