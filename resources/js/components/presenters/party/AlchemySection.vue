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
                            <a v-else-if="isUnlocked(cell)" @click.prevent="openItem(cell.item)" class="relative rounded overflow-hidden cursor-pointer" href="#">
                                <webp :src="cell.item.image" width="45" class="top-0 absolute max-w-none rounded item-thumbnail"
                                      :alt="$t(cell.item.name)" :animate="true"/>
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
                    <p class="flex">{{ $t('Are you sure you want to brew a potion using') + ': ' }}
                        <span v-if="brewingCell" class="inline-flex">
                            <add-links-and-icons v-if="brewingCell.ingredients" :text="brewingCell.ingredients" class="inline-flex"/>
                            <template v-if="!brewingCell.ingredients" v-for="(count, resource) in brewingCell.item.cost">
                                <inline-svg  v-if="resource !== 'any'" :src="'resources/'+resource"/>
                                <div v-if="resource === 'any'" class="relative">
                                    <div v-for="(resource, index) in resources">
                                        <inline-svg :src="'resources/'+resource"
                                                    class="absolute w-full left-0 transition-opacity duration-500"
                                                    :class="[index === anyIndex ? 'opacity-1' : 'opacity-0']"/>
                                    </div>
                                    <span class="ml-6">x {{ count }}</span>
                                </div>
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
        sheet: {
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
            brewingCell: null,
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
                            return {
                                item: this.itemRepository.find(cell),
                            }
                        } else if (typeof cell === 'string' && cell.substring(0, 1) === ':') {
                            let recipe = chart.recipes[cell]
                            return {
                                recipe: cell,
                                ingredients: recipe.ingredients,
                                item: this.itemRepository.find(recipe.item),
                            }
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
        isUnlocked(cell) {
            if (cell.recipe) {
                return this.sheet.recipes[cell.recipe] || false;
            }
            else {
                return this.sheet.itemDesigns[cell.item._id] || false;
            }
        },
        openItem(item) {
            this.$bus.$emit('open-item', {item});
        },
        brew(cell) {
            this.brewingCell = cell;
            this.$refs['brew-potion-modal'].open();
        },
        unlock() {
            if (this.brewingCell) {
                if (this.brewingCell.recipe) {
                    Vue.set(this.sheet.recipes, this.brewingCell.recipe, true);
                }
                Vue.set(this.sheet.itemDesigns, this.brewingCell.item._id, true);
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
