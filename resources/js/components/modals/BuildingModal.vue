<template>
    <div>
        <modal ref="modal" :title="this.title" :max-width="'348px'">
            <div v-if="building" slot="content" class="w-full h-full flex flex-col outline-none">
                <div class="relative w-full" style="max-width: 300px;">
                    <webp :src="building.card()" :alt="this.title"
                          class="w-full rounded-lg sm:rounded-xl"/>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

import Building from "../../models/Building";
import BuildingRepository from "../../repositories/BuildingRepository";

export default {
    data() {
        return {
            building: null,
            buildingRepository: new BuildingRepository,
        }
    },
    computed: {
        title() {
            return this.building ?
                this.building.id + ' ' + this.$t(this.building.name) + ' ' + this.$t('Lvl.') + ' ' + this.building.level
                : '';
        },
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
