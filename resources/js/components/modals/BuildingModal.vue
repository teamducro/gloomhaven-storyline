<template>
    <div>
        <modal ref="modal" :title="this.title" :max-width="hasSideBar ? '' : '348px'" @closed="close"
               class="building-modal">
            <div v-if="building" slot="content">
                <div class="w-full h-full flex flex-col md:flex-row outline-none">
                    <div class="relative w-full" style="max-width: 300px;">
                        <webp :src="building.card()" :alt="this.title"
                              class="w-full rounded-lg sm:rounded-xl"/>
                    </div>
                    <div v-if="hasSideBar" class="md:ml-4 mb-4">
                        <component :is="sidebar"></component>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Building from "../../models/Building";
import BuildingRepository from "../../repositories/BuildingRepository";
import AlchemistSidebar from "./AlchemistSidebar.vue";

export default {
    data() {
        return {
            building: null,
            buildingRepository: new BuildingRepository,
            sidebars: {
                'fh-35': AlchemistSidebar
            }
        }
    },
    computed: {
        title() {
            return this.building ?
                this.building.id + ' ' + this.$t(this.building.name) + ' ' + this.$t('Lvl.') + ' ' + this.building.level
                : '';
        },
        hasSideBar() {
            return this.building && this.sidebar;
        },
        sidebar() {
            return this.sidebars[this.building.game+'-'+this.building.id];
        }
    },
    mounted() {
        this.$bus.$on('open-building-card', (building) => {
            this.open(building);
        });
        this.$bus.$on('close-building-card', this.close);
    },
    methods: {
        async open(building) {
            this.building = building instanceof Building ? building : this.buildingRepository.find(building.id);
            this.$refs['modal'].open();
        },
        close() {
            this.building = null;
            this.$refs['modal'].close();
        }
    }
}
</script>

<style lang="scss">
    .mdc-dialog.building-modal .mdc-dialog__surface {
        width: auto;
        max-width: fit-content;
    }
</style>
