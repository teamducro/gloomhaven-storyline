<template>
    <div class="w-full mt-8">
        <slot name="title">
            <h2 class="mb-2">{{ $t('Buildings') }}</h2>
        </slot>
        <autocomplete
            :label="$t('Add buildings')"
            id="buildings"
            :list="buildings.items.map(b => b.id.toString())"
            @change="toggle">
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
            <div v-for="building in activeBuildings" :key="building.key()" class="bg-dark-background grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px mb-3">
                <div class="outline-gray row-span-2 sm:col-span-2 lg:col-span-1 flex items-center p-3">
                    {{ building.id }} {{ $t(building.name) }} {{ $t('Lvl.') }} {{ building.level }}
                </div>
                <template v-if="!building.isWrecked()">
                    <div class="outline-gray flex flex-col items-center p-2 md:row-start-3 lg:row-start-auto" :class="{ 'row-span-2': !$t(building.passive) }">
                        <add-links-and-icons text="{OPERATIONS}" class="mb-1"/>
                        <add-links-and-icons class="inline-icons" :text="$t(building.operations) || '-'"/>
                    </div>
                    <div class="outline-gray flex flex-col items-center p-2 md:row-start-3 lg:row-start-auto" :class="{ 'row-span-2': !$t(building.passive) }">
                        <add-links-and-icons text="{DOWNTIME}" class="mb-1"/>
                        <add-links-and-icons class="inline-icons" :text="$t(building.downtime) || '-'"/>
                    </div>
                    <add-links-and-icons v-if="$t(building.passive)" :text="$t(building.passive)" class="inline-icons outline-gray text-center sm:col-span-2 md:row-start-4 lg:row-start-2 lg:col-start-2 p-1"/>
                </template>
                <div v-else class="outline-gray flex flex-col items-center p-2 row-span-2 sm:col-span-2 md:row-start-3 lg:row-start-auto">
                    <add-links-and-icons text="{WRECKED}" class="mb-1"/>
                    <add-links-and-icons class="inline-icons" :text="$t(building.wrecked) || '-'"/>
                </div>
                <div class="outline-gray row-span-2 flex items-center justify-center p-2">
                    <button v-if="!building.completed" :disabled="building.isWrecked()" @click="upgrade(building)" class="mdc-button mdc-button--raised" :class="{ 'h-auto p-1': !building.lockedUpgrade }">
                        <add-links-and-icons text="{UPGRADE}"/>
                        <div v-if="!building.lockedUpgrade" class="bg-dark-background inline-grid grid-cols-4 gap-px ml-1">
                            <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <template v-for="(cost, i) in building.nextUpgradeCost.slice(0, 4)">
                                <div :key="i" class="outline-gray text-center">{{ cost }}</div>
                            </template>
                            <div v-if="building.nextUpgradeCost[5]" class="col-span-4">-{{ building.nextUpgradeCost[5] }} {{ $t('Morale') }}</div>
                        </div>
                        <div v-else>
                            {{ $t('Upgrade') }}
                        </div>
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
                    <button v-else @click="repair(building)" class="mdc-button mdc-button--raised h-auto p-1">
                        <add-links-and-icons text="{REPAIR}"/>
                        <div class="bg-dark-background inline-grid grid-cols-3 gap-px ml-1">
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <template v-for="(cost, i) in building.wreckedCost">
                                <div :key="i" class="outline-gray text-center">{{ cost }}</div>
                            </template>
                        </div>
                    </button>
                </div>
            </div>
            <div v-for="building in availableBuildings" :key="building.key()" class="grid xs:grid-cols-3 lg:grid-cols-5 gap-px mb-3">
                <div class="text-gray-400 outline-gray flex items-center p-3 bg-dark-background">
                    {{ building.id }} {{ $t(building.name) }} {{ $t('Lvl.') }} 0
                </div>
                <div class="xs:col-span-2 outline-gray flex items-center justify-center p-2 bg-dark-background">
                    <button @click="upgrade(building)" class="mdc-button mdc-button--raised h-auto p-1">
                        <add-links-and-icons text="{UPGRADE}"/>
                        <div class="bg-dark-background inline-grid grid-cols-5 gap-px ml-1">
                            <add-links-and-icons text="{PROSPERITY}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{LUMBER}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{METAL}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{HIDE}" class="outline-gray p-1"/>
                            <add-links-and-icons text="{COINS}" class="outline-gray p-1"/>
                            <template v-for="(cost, i) in building.nextUpgradeCost.slice(0, 5)">
                                <div :key="i" class="outline-gray text-center">{{ cost }}</div>
                            </template>
                        </div>
                    </button>
                </div>
            </div>
        </div>
        <autocomplete
            :label="$t('Add overlay stickers')"
            id="overlays"
            :list="overlays.items.map(o => o.id)"
            @change="toggleOverlays">
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
        <div id="overlay-badges">
            <span v-for="overlay in overlays.filter(overlay => overlay.present)" :key="overlay.id">
                <bedge class="mr-2 mt-2 white rounded-md animate__animated"
                        :class="{
                            'cursor-pointer': !appData.read_only,
                        }"
                        @click="(e) => {toggleOverlays(overlay.id)}">
                    {{ overlayDisplayName(overlay) }}
                    <span class="ml-1" v-if="!appData.read_only">×</span>
                </bedge>
            </span>
        </div>
    </div>
</template>

<script>
import Slugify from "../../../services/Slugify";
import BuildingRepository from "../../../repositories/BuildingRepository";
import OverlayRepository from "../../../repositories/OverlayRepository";

export default {
    inject: ['appData'],
    mixins: [Slugify],
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            buildingRepository: new BuildingRepository(),
            overlayRepository: new OverlayRepository(),
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
            return this.buildingRepository.where(b => !b.isLocked() && !b.isAvailable());
        },
        availableBuildings() {
            return this.buildingRepository.whereState('available');
        }
    },
    methods: {
        toggle(id) {
            let building = this.buildingRepository.find(id);

            if (building.isLocked()) {
                this.buildingRepository.setAvailable(building);
            } else {
                this.buildingRepository.setLocked(building);
            }

            // Toggling resets level:
            building.level = 0;
        },
        upgrade(building) {
            if (building.isAvailable()) {
                this.buildingRepository.setBuilt(building);
            }
            building.level += 1;
        },
        wreck(building) {
            this.buildingRepository.setWrecked(building);
        },
        repair(building) {
            this.buildingRepository.setBuilt(building);
        },
        overlayDisplayName(overlay, showName = true) {
            // Replace "G_red" with "G (red)"
            let id = overlay.id.replace(/_(.*)/, showName ? '' : ' ($1)');
            // Put name in brackets if present
            return id + ((this.$t(overlay.name) && showName) ? ` (${this.$t(overlay.name)})`: '');
        },
        toggleOverlays(id) {
            let overlay = this.overlayRepository.find(id);
            if (!overlay.present) {
                this.overlayRepository.add(overlay.id);
            } else {
                this.overlayRepository.remove(overlay.id);
            }
        },
    }
}
</script>

<style scoped lang="scss">
.inline-icons :deep(div), .inline-icons :deep(svg) {
    @apply inline;
}
.materials :deep(svg) {
    @apply h-3 w-3;
}
</style>
