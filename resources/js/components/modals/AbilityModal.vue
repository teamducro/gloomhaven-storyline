<template>
    <div>
        <modal ref="modal" :max-width="'348px'">
            <template v-slot:title>
                <span class="capitalize">
                    {{ ability ? $t(ability.name) : '' }}
                </span>
            </template>
            <div v-if="ability" slot="content" class="w-full h-full flex flex-col outline-none">
                <div class="relative w-full" style="max-width: 300px;">
                    <webp :src="ability.image" :alt="$t(ability.name)"
                          class="w-full rounded-lg sm:rounded-xl"/>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

export default {
    data() {
        return {
            ability: null
        }
    },
    mounted() {
        this.$bus.$on('open-ability-card', (ability) => {
            this.open(ability);
        });
        this.$bus.$on('close-ability-card', this.close);
    },
    methods: {
        async open(ability) {
            this.ability = ability;
            this.$refs['modal'].open();
        },
        close() {
            this.card = null;
            this.$refs['modal'].close();
        }
    }
}
</script>
