<template>
    <modal ref="modal" :title="$t('about us.title')">
        <template v-slot:content>
            <p>{{ $t('about us.text') }}</p>
            <div class="m-4">
                <webp src="/img/minis.jpg" alt="Gloomhaven minis"/>
            </div>
        </template>
    </modal>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {
            this.$bus.$on('open-about-us-modal', this.open);
        },
        methods: {
            open() {
                this.$refs['modal'].open();
            }
        }
    }
</script>
