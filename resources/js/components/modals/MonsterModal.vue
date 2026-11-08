<template>
    <div>
        <modal ref="modal" :title="monster ? $t('monsters.' + monster) : ''" :max-width="'348px'">
            <template #content>
                <div v-if="portrait" id="monster-image" class="w-full outline-hidden">
                    <webp :src="portrait" :alt="$t('monsters.' + monster)" class="w-full rounded-lg"/>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import MonsterImages from "../../services/MonsterImages";

export default {
    data() {
        return {
            game: null,
            monster: null,
        }
    },
    computed: {
        portrait() {
            return this.monster ? MonsterImages.portrait(this.game, this.monster) : null;
        }
    },
    mounted() {
        this.$bus.$on('open-monster', ({game, monster}) => {
            this.game = game;
            this.monster = monster;
            this.$refs['modal'].open();
        });
    },
}
</script>
