<template>
    <div>
        <div class="mb-2 flex items-center">
            <slot name="title">
                <add-links-and-icons class="flex items-center gap-2" tag="h2" :text="'{SOLDIER}' + $t('Soldiers')"/>
            </slot>
            <rollback :loading="loading" ref="rollback"
                      :value.sync="sheet.soldiers"/>
        </div>
        <div class="flex flex-col">
            <div v-for="(soldiers, lvl) in soldiersPerLvl" class="flex items-center">
                <span class="font-title mr-1 inline-block w-2">{{ lvl + 1 }}</span>
                <checkbox v-for="s in soldiers" style="transform: scale(0.7)" class="-m-1"
                          :key="'soldier-'+s" :id="'s-'+s" group="soldiers"
                          :checked="sheet.soldiers >= s"
                          @change="changed"/>
            </div>
        </div>
    </div>
</template>

<script>
import CampaignSheet from "../../../models/CampaignSheet";

export default {
    props: {
        sheet: {
            type: CampaignSheet,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            soldierCountPerLvl: [4, 2, 2, 2],
        }
    },
    computed: {
        soldiersPerLvl() {
            let currentValue = 1;
            return this.soldierCountPerLvl.map(length => {
                const subArray = [];
                for (let i = 0; i < length; i++) {
                    subArray.push(currentValue++);
                }
                return subArray;
            });
        }
    },
    methods: {
        changed(soldier, isChecked) {
            let s = parseInt(soldier.split('-')[1]);
            if (!isChecked) {
                s = s - 1;
            }
            this.sheet.soldiers = s;
            this.$emit('change', s);
        },
        reset() {
            this.$refs['rollback']?.reset();
        }
    }
}
</script>
