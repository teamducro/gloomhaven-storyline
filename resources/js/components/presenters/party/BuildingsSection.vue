<template>
    <div class="w-full mt-8">
        <h2 v-if="combinedResources" class="mb-2">{{ $t('Combined Resources') }}</h2>

        <div v-if="combinedResources" class="mb-4 inline-flex flex-wrap gap-4">
            <div>
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="'{PROSPERITY}' + $t('Prosperity')"/>
                <span class="font-title ml-2">{{ combinedResources.prosperity }}</span>
            </div>
            <div>
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="'{LUMBER}' + $t('Lumber')"/>
                <span class="font-title ml-2">{{ combinedResources.lumber }}</span>
            </div>
            <div>
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="'{METAL}' + $t('Metal')"/>
                <span class="font-title ml-2">{{ combinedResources.metal }}</span>
            </div>
            <div>
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="'{HIDE}' + $t('Hide')"/>
                <span class="font-title ml-2">{{ combinedResources.hide }}</span>
            </div>
            <div>
                <add-links-and-icons class="text-white flex items-center gap-2" tag="h2" :text="'{COINS}' + $t('Gold')"/>
                <span class="font-title ml-2">{{ combinedResources.gold }}</span>
            </div>
        </div>

        <h2 class="mb-2">{{ $t('Overlay Stickers') }}</h2>
        <autocomplete
            :label="$t('Add overlay stickers')"
            id="overlays"
            :list="overlays.items.map(o => o.id)"
            @change="toggleOverlay">
            <template v-for="overlay in overlays" v-slot:[slugify(overlay.id)]>
                <div class="w-full flex items-center justify-between" :key="overlay.id">
                    <slot name="label" :item="overlay.id">
                        <span>{{ overlayDisplayName(overlay, false) }}</span>
                    </slot>
                    <span class="material-icons">
                        {{ overlay.present ? 'check_circle_outline' : 'radio_button_unchecked' }}
                    </span>
                </div>
            </template>
        </autocomplete>
        <div id="overlay-badges" class="mb-12">
            <span v-for="overlay in overlays.filter(overlay => overlay.present)" :key="overlay.id">
                <bedge class="mr-2 mt-2 white rounded-md animate__animated"
                        :class="{
                            'cursor-pointer': !appData.read_only,
                        }"
                        @click="(e) => {toggleOverlay(overlay)}">
                    {{ overlayDisplayName(overlay) }}
                    <span class="ml-1" v-if="!appData.read_only">×</span>
                </bedge>
            </span>
        </div>
        <h2 class="mb-2">{{ $t('Buildings') }}</h2>
        <autocomplete
            :label="$t('Add buildings')"
            id="buildings"
            :list="buildings.items.map(b => b.id.toString())"
            @change="toggle"
            class="mb-8">
            <template v-for="building in buildings" v-slot:[slugify(building.id)]>
                <div class="w-full flex items-center justify-between" :key="building.id">
                    <slot name="label" :item="building.id">
                        <span>{{ building.id }}</span>
                    </slot>
                    <span class="material-icons">
                        {{ building.isUnlocked() ? 'check_circle_outline' : 'radio_button_unchecked' }}
                    </span>
                </div>
            </template>
        </autocomplete>
        <div>
            <div v-for="building in activeBuildings" :key="building.key()" class="bg-dark-gray2-60 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px mb-3">
                <div class="hover:pointer outline-gray row-span-2 sm:col-span-2 lg:col-span-1 flex flex-col items-center justify-center p-3"
                     @click="openCard(building)">
                    <img v-if="building.image()" :src="building.image()" class="h-12" :alt="building.name + ' ' + $t('Lvl.') + ' ' + building.level"/>
                    <span>{{ building.id }} {{ $t(building.name) }} {{ $t('Lvl.') }} {{ building.level }}</span>
                </div>
                <template v-if="!building.isWrecked()">
                    <div class="hover:pointer outline-gray flex flex-col items-center p-2 md:row-start-3 lg:row-start-auto" :class="{ 'row-span-2': !$t(building.passive) }"
                         @click="openCard(building)">
                        <add-links-and-icons text="{OPERATIONS}" class="mb-1"/>
                        <add-links-and-icons class="inline-icons" :text="$t(building.operations) || '-'"/>
                    </div>
                    <div class="hover:pointer outline-gray flex flex-col items-center p-2 md:row-start-3 lg:row-start-auto" :class="{ 'row-span-2': !$t(building.passive) }"
                         @click="openCard(building)">
                        <add-links-and-icons text="{DOWNTIME}" class="mb-1"/>
                        <add-links-and-icons class="inline-icons" :text="$t(building.downtime) || '-'"/>
                    </div>
                    <add-links-and-icons v-if="$t(building.passive)" :text="$t(building.passive)" class="inline-icons outline-gray text-center sm:col-span-2 md:row-start-4 lg:row-start-2 lg:col-start-2 p-1"/>
                </template>
                <div v-else class="hover:pointer outline-gray flex flex-col items-center p-2 row-span-2 sm:col-span-2 md:row-start-3 lg:row-start-auto"
                     @click="openCard(building)">
                    <add-links-and-icons text="{WRECKED}" class="mb-1"/>
                    <add-links-and-icons class="inline-icons" :text="$t(building.wrecked) || '-'"/>
                </div>
                <div class="outline-gray row-span-2 flex flex-col items-center justify-center p-2">
                    <button v-if="!building.completed" :disabled="building.isWrecked()" @click="upgrade(building)" class="mdc-button mdc-button--raised" :class="{ 'h-auto p-1': !building.lockedUpgrade, 'gray': !building.isWrecked() && !building.checkUpgradeCost(combinedResources) }">
                        <add-links-and-icons text="{UPGRADE}"/>
                        <div v-if="!building.lockedUpgrade" class="bg-dark-background inline-grid grid-cols-4 gap-px ml-1">
                            <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <div v-for="(cost, i) in building.nextUpgradeCost.slice(0, 4)"
                                 :key="building.id + '-next-upgrade-cost-' + i"
                                 class="outline-gray text-center">{{ cost }}</div>
                            <div v-if="building.nextUpgradeCost[5]" class="col-span-4">-{{ building.nextUpgradeCost[5] }} {{ $t('Morale') }}</div>
                        </div>
                        <div v-else>
                            {{ $t('Upgrade') }}
                        </div>
                    </button>
                    <div v-else-if="building.game === 'fh' && building.id === 84" class="flex flex-col gap-2">
                        <button v-for="overlay in overlays.filter(overlay => !overlay.present && overlay.icon)"
                            @click="toggleOverlay(overlay)" :disabled="building.isWrecked()" :key="overlay.id" class="mdc-button mdc-button--raised h-auto p-1" :class="{'gray': !overlay.checkBuildCost(combinedResources) }">
                            <add-links-and-icons :text="overlay.icon"/>
                            <div class="bg-dark-background inline-grid grid-cols-4 gap-px ml-1">
                                <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                                <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                                <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                                <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                                <div v-for="(cost, i) in overlay.upgradeCost.slice(0, 4)"
                                     :key="overlay.id + '-upgrade-cost-' + i"
                                     class="outline-gray text-center">{{ cost }}</div>
                            </div>
                        </button>
                    </div>
                    <button v-if="building.upgraded" class="mdc-button -mb-2" @click="downgrade(building)">
                        <span class="material-icons mr-1">replay</span> {{ $t('Downgrade') }}
                    </button>
                </div>
                <div class="outline-gray row-span-2 flex flex-col items-center justify-center p-2">
                    <div v-if="!building.isWrecked()" class="flex items-center mb-1">
                        <add-links-and-icons text="{REPAIR}"/>:
                        {{ $t('Any') + ' ' + building.damageCost }}
                        <add-links-and-icons class="materials flex ml-1" text="{LUMBER} {METAL} {HIDE}"/>
                    </div>
                    <button v-if="!building.isWrecked()" @click="wreck(building)" class="mdc-button mdc-button--raised">
                        <add-links-and-icons text="{WRECKED}"/>
                        {{ $t('Wreck') }}
                    </button>
                    <button v-else @click="repair(building)" class="mdc-button mdc-button--raised h-auto p-1" :class="{'gray': !building.checkWreckedCost(combinedResources) }">
                        <add-links-and-icons text="{REPAIR}"/>
                        <div class="bg-dark-background inline-grid grid-cols-3 gap-px ml-1">
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <div v-for="(cost, i) in building.wreckedCost"
                                 :key="building.id + '-wrecked-cost-' + i"
                                 class="outline-gray text-center">{{ cost }}</div>
                        </div>
                    </button>
                </div>
            </div>
            <h3 v-if="availableBuildings.count()" class="mb-2">{{ $t('Available') }}</h3>
            <div v-for="building in availableBuildings" :key="building.key()" class="grid xs:grid-cols-3 lg:grid-cols-5 gap-px mb-3">
                <div class="outline-gray flex items-center p-3 bg-dark-gray2-60">
                    <span>{{ building.id }} {{ $t(building.name) }} {{ $t('Lvl.') }} {{ building.level }}</span>
                </div>
                <div class="xs:col-span-2 outline-gray flex items-center justify-center p-2 bg-dark-gray2-60">
                    <button @click="upgrade(building)" class="mdc-button mdc-button--raised h-auto p-1" :class="{'gray': !building.checkUpgradeCost(combinedResources)}">
                        <add-links-and-icons text="{BUILD}"/>
                        <div class="bg-dark-background inline-grid grid-cols-5 gap-px ml-1">
                            <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{COINS}" class="outline-gray p-1"/>
                            <div v-for="(cost, i) in building.nextUpgradeCost.slice(0, 5)"
                                 :key="building.id + '-cost-' + i"
                                 class="outline-gray text-center">{{ cost }}</div>
                        </div>
                    </button>
                </div>
            </div>
            <h3 v-if="overlays.some(overlay => !overlay.present && overlay._name === 'Wall')" class="mb-2">{{ $t('Walls') }}</h3>
            <div v-for="overlay in overlays.filter(overlay => !overlay.present && overlay._name === 'Wall')"
                    :key="overlay.key()" class="grid xs:grid-cols-3 lg:grid-cols-5 gap-px mb-3">
                <div class="outline-gray flex items-center p-3 bg-dark-gray2-60">
                    <span>{{ $t(overlay.name) }} {{ overlay.id }}</span>
                </div>
                <div class="xs:col-span-2 outline-gray flex items-center justify-center p-2 bg-dark-gray2-60">
                    <button @click="toggleOverlay(overlay)" class="mdc-button mdc-button--raised h-auto p-1" :class="{'gray': !overlay.checkBuildCost(combinedResources)}">
                        <add-links-and-icons text="{BUILD}"/>
                        <div class="bg-dark-background inline-grid grid-cols-5 gap-px ml-1">
                            <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{COINS}" class="outline-gray p-1"/>
                            <div v-for="(cost, i) in overlay.upgradeCost.slice(0, 5)"
                                 :key="overlay.id + '-cost-' + i"
                                 class="outline-gray text-center">{{ cost }}</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <modal ref="boat-modal" :title="$t('Name your Boat')">
            <template v-slot:content>
                <p class="mb-3">“{{ $t('Now, whaddya call this beauty? G’head, pick a name. Bad luck to set forth on an unnamed vessel!') }}”</p>
                <text-field id="boat-name" :label="$t('Boat Name')" :value.sync="boatName" @keyup.enter="saveBoatName" />
            </template>
            <template v-slot:buttons>
                <button type="button" class="mdc-button mdc-dialog__button mdc-button--raised" data-mdc-dialog-action="yes" @click="saveBoatName">
                    <span class="mdc-button__label">{{ $t('Confirm') }}</span>
                </button>
            </template>
        </modal>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";
import BuildingRepository from "../../../repositories/BuildingRepository";
import OverlayRepository from "../../../repositories/OverlayRepository";
import {BuildingState} from "../../../models/BuildingState";
import SheetRepository from "../../../repositories/SheetRepository";
import CharacterRepository from "../../../repositories/CharacterRepository";
import SheetCalculations from "../../../services/SheetCalculations";
import Confirm from "../../../mixins/Confirm";

export default {
    inject: ['appData'],
    mixins: [Slugify, SheetCalculations, Confirm],
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            combinedResources: null,
            buildingRepository: new BuildingRepository,
            overlayRepository: new OverlayRepository,
            sheetRepository: new SheetRepository,
            characterRepository: new CharacterRepository,
            boatName: "",
        };
    },
    computed: {
        buildings() {
            return this.buildingRepository.get();
        },
        overlays() {
            return this.overlayRepository.get();
        },
        activeBuildings() {
            return this.buildingRepository.where(b => b.isActive());
        },
        availableBuildings() {
            return this.buildingRepository.whereState(BuildingState.available);
        }
    },
    mounted() {
        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    methods: {
        render() {
            this.countResources();
        },
        toggle(id) {
            let building = this.buildingRepository.find(id);

            if (building.isLocked()) {
                this.buildingRepository.setAvailable(building);
            } else {
                this.buildingRepository.setLocked(building);
            }

            // Toggling resets level:
            building.level = 0;

            this.changed();
        },
        upgrade(building) {
            const upgrade = () => {
                if (building.isAvailable()) {
                    this.buildingRepository.setBuilt(building);
                }
                building.level += 1;

                this.changed();
            }

            if (!building.checkUpgradeCost(this.combinedResources)) {
                let title = this.$t('Are you sure you want to upgrade it?');
                let message = this.$t('Note; You do not have enough resources to upgrade it.');

                if (building.isAvailable()) {
                    title = this.$t('Are you sure you want to build it?');
                    message = this.$t('Note; You do not have enough resources to build it.');
                }

                this.confirm(title, message, upgrade);
            } else {
                upgrade();
            }
        },
        downgrade(building) {
            building.level -= 1;
            if (building.level <= 0) {
                building.level = 0;
                this.buildingRepository.setAvailable(building);
            }

            this.changed();
        },
        wreck(building) {
            this.buildingRepository.setWrecked(building);

            this.changed();
        },
        repair(building) {
            const build = () => {
                this.buildingRepository.setBuilt(building);

                this.changed();
            }

            if (!building.checkWreckedCost(this.combinedResources)) {
                const title = this.$t('Are you sure you want to repair it?');
                const message = this.$t('Note; You do not have enough resources to repair it.');
                this.confirm(title, message, build);
            } else {
                build();
            }
        },
        overlayDisplayName(overlay, showName = true) {
            // Replace "G_red" with "G (red)"
            let id = overlay.id.replace(/_(.*)/, showName ? '' : ' ($1)');
            // Put name in brackets if present
            return id + ((this.$t(overlay.name) && showName) ? ` (${this.$t(overlay.name)})`: '');
        },
        toggleOverlay(overlayOrId) {
            let overlay = typeof overlayOrId === 'object' ? overlayOrId
                : this.overlayRepository.find(overlayOrId)

            if (!overlay.present) {
                const build = () => {
                    this.overlayRepository.add(overlay.id);

                    if (overlay.game === 'fh' && overlay.id === 'A') {
                        this.openBoatModal();
                    }

                    this.changed();
                }

                if (!overlay.checkBuildCost(this.combinedResources)) {
                    const title = this.$t('Are you sure you want to build it?');
                    const message = this.$t('Note; You do not have enough resources to build it.');
                    this.confirm(title, message, build);
                } else {
                    build();
                }
            } else {
                this.overlayRepository.remove(overlay.id);
            }
        },
        openBoatModal() {
            this.$refs['boat-modal'].open();
        },
        saveBoatName() {
            this.overlayRepository.find('A').name = this.boatName || 'Boat';
            this.changed();
        },
        countResources() {
            let sheet = this.sheetRepository.make(this.appData.game);

            // Add resources from sheet
            let combinedResources = {
                prosperity: this.calculateProsperity(sheet.prosperityIndex, sheet.game),
                lumber: sheet.resources.lumber || 0,
                metal: sheet.resources.metal || 0,
                hide: sheet.resources.hide || 0,
                gold: 0
            };

            // Add resources from characters
            collect(sheet.characters).each(character => {
                combinedResources.lumber += character.resources?.lumber || 0;
                combinedResources.metal += character.resources?.metal || 0;
                combinedResources.hide += character.resources?.hide || 0;
                combinedResources.gold += character.gold || 0;
            });

            this.combinedResources = combinedResources
        },
        changed() {
            this.$emit('change');
        },
        openCard(building) {
            this.$bus.$emit('open-building-card', building);
        }
    }
}
</script>

<style scoped lang="scss">
.inline-icons ::v-deep div, .inline-icons ::v-deep svg {
    @apply inline;
}
.materials ::v-deep svg {
    @apply h-3 w-3;
}
</style>
