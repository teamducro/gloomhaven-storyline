<template xmlns="http://www.w3.org/1999/html">
    <li>
        <ul>
            <li v-for="(name, code) in games" :key="code" :class="code" @click="select(code)">
                <a class="mdc-list-item !pl-14 !-my-0">
                    <span class="mdc-list-item__text">
                        {{ name }}
                        <bedge v-if="beta.includes(code)" class="small white ml-2">BETA</bedge>
                    </span>
                </a>
            </li>
        </ul>
    </li>
</template>

<script>

export default {
    data() {
        return {
            current: null,
            games: {
                gh: this.$t('Gloomhaven'),
                fc: this.$t('Forgotten Circles'),
                jotl: this.$t('Jaws of the Lion'),
            },
            beta: ['jotl']
        }
    },
    mounted() {
        this.setCurrent();
        this.$bus.$on('campaigns-changed', this.setCurrent);
    },
    destroyed() {
        this.$bus.$off('campaigns-changed', this.setCurrent);
    },
    methods: {
        setCurrent() {
            this.current = app.game;
        },
        select(code) {
            if (this.current !== code) {
                this.$emit('click');
                this.$bus.$emit('game-selected', code);
            }
        }
    }
}
</script>
