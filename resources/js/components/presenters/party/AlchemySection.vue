<template>
    <div v-if="alchemist">
        <div v-for="chart in charts" v-if="alchemist.level >= chart.level" class="flex flex-wrap">
            <div>
                <h2 class="my-4">{{ $t(chart.title) }}</h2>
                <div class="grid gap-4" :class="'grid-cols-'+chart.chart[0].length">
                    <template v-for="row in chart.chart">
                        <template v-for="cell in row">
                            <span v-if="cell === ''"/>
                            <div v-else-if="cell === 'any'" class="relative">
                                <div v-for="(resource, index) in resources">
                                    <inline-svg :src="'resources/'+resource"
                                                class="absolute w-full left-0 transition-opacity duration-500"
                                                :class="[index === anyIndex ? 'opacity-1' : 'opacity-0']"/>
                                </div>
                            </div>
                            <inline-svg  v-else-if="typeof cell === 'string'" :src="'resources/'+cell"/>
                            <a v-else-if="isUnlocked(cell)" @click.prevent="openItem(cell)" class="relative rounded overflow-hidden cursor-pointer" href="#">
                                <webp :src="cell.image" width="45" class="top-0 absolute max-w-none rounded item-thumbnail"
                                      :alt="$t(cell.name)" :animate="true"/>
                            </a>
                            <a v-else @click.prevent="brew(cell)" class="cursor-pointer outline-gray rounded" href="#"/>
                        </template>
                    </template>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <modal ref="brew-potion-modal" :title="$t('Brew a new potion!')">
                <template v-slot:content>
                    <p>{{ $t('Are you sure you want to brew a potion using') + ': ' }}
                        <span v-if="brewingItem" class="inline-flex">
                            <template v-for="(count, resource) in brewingItem.cost">
                                <inline-svg  v-if="resource !== 'any'" :src="'resources/'+resource"/>
                                <span v-else-if="count === 2">{{ $t('any 2 herbs') }}</span>
                                <span v-else-if="count === 3">{{ $t('any 3 herbs') }}</span>
                            </template>
                        </span>
                    </p>
                </template>
                <template v-slot:buttons>
                    <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
                        <span class="mdc-button__label">{{ $t('Cancel') }}</span>
                    </button>
                    <button type="button" class="mdc-button mdc-dialog__button mdc-button--raised" data-mdc-dialog-action="yes"
                            @click="unlock">
                        <span class="mdc-button__label">{{ $t('Confirm') }}</span>
                    </button>
                </template>
            </modal>
        </Teleport>
    </div>
</template>

<script>

import GameData from "../../../services/GameData";
import BuildingRepository from "../../../repositories/BuildingRepository";
import ItemRepository from "../../../repositories/ItemRepository";
import AddLinksAndIcons from "../../elements/AddLinksAndIcons.vue";
import {shuffle} from "lodash";
import Teleport from 'vue2-teleport';

export default {
    inject: ['appData', Teleport],
    components: {AddLinksAndIcons},
    props: {
        itemDesigns: {
            type: Object,
            default: {}
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            anyIndex: 0,
            resources: ['flamefruit', 'corpsecap', 'axenut', 'snowthistle', 'rockroot', 'arrowvine'],
            charts: [],
            alchemist: null,
            brewingItem: null,
            buildingRepository: new BuildingRepository,
            itemRepository: new ItemRepository,
        }
    },
    mounted() {
        this.resources = shuffle(this.resources);
        setInterval(this.cycleAnyIcon, 3000);

        this.render();

        this.$bus.$on('campaigns-changed', this.render);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.render);
    },
    watch: {

    },
    methods: {
        render() {
            this.alchemist = this.buildingRepository.findName('Alchemist');

            if (!this.alchemist) {
                return;
            }

            // Fill chart with item instances
            const gameData = new GameData;
            const charts = gameData.alchemy(this.appData.game);
            this.charts = charts.map((chart) => {
                chart.chart = chart.chart.map((row) => {
                    return row.map((cell) => {
                        if (cell !== '' && !isNaN(cell)) {
                            return this.itemRepository.find(cell);
                        }
                        return cell;
                    });
                });
                return chart;
            })
        },
        cycleAnyIcon() {
            if(this.anyIndex === this.resources.length - 1) {
                this.anyIndex = 0;
            } else {
                this.anyIndex++;
            }
        },
        isUnlocked(item) {
            return this.itemDesigns[item._id] || false;
        },
        openItem(item) {
            this.$bus.$emit('open-item', {item});
        },
        brew(item) {
            this.brewingItem = item;
            this.$refs['brew-potion-modal'].open();
        },
        unlock() {
            if (this.brewingItem) {
                Vue.set(this.itemDesigns, this.brewingItem._id, true);
                this.$emit('change');
            }
        },
    }
}
</script>
<style scoped lang="scss">
.item-thumbnail {
    margin-left: -23%;
    margin-top: -40%;
}
</style>
