<template>
    <div class="mt-4 grid grid-cols-2 xs:grid-cols-3 gap-4">
        <counter-section
            ref="lumber"
            :title="'{LUMBER}' + $t('Lumber')"
            :value.sync="currentResources.lumber"
            :loading="loading"/>

        <counter-section
            ref="metal"
            :title="'{METAL}' + $t('Metal')"
            :value.sync="currentResources.metal"
            :loading="loading"/>

        <counter-section
            ref="hide"
            :title="'{HIDE}' + $t('Hide')"
            :value.sync="currentResources.hide"
            :loading="loading"/>

        <counter-section
            ref="arrowvine"
            :title="'{ARROWVINE}' + $t('Arrowvine')"
            :value.sync="currentResources.arrowvine"
            :loading="loading"/>

        <counter-section
            ref="axenut"
            :title="'{AXENUT}' + $t('Axenut')"
            :value.sync="currentResources.axenut"
            :loading="loading"/>

        <counter-section
            ref="corpsecap"
            :title="'{CORPSECAP}' + $t('Corpsecap')"
            :value.sync="currentResources.corpsecap"
            :loading="loading"/>

        <counter-section
            ref="flamefruit"
            :title="'{FLAMEFRUIT}' + $t('Flamefruit')"
            :value.sync="currentResources.flamefruit"
            :loading="loading"/>

        <counter-section
            ref="rockroot"
            :title="'{ROCKROOT}' + $t('Rockroot')"
            :value.sync="currentResources.rockroot"
            :loading="loading"/>

        <counter-section
            ref="snowthistle"
            :title="'{SNOWTHISTLE}' + $t('Snowthistle')"
            :value.sync="currentResources.snowthistle"
            :loading="loading"/>
    </div>
</template>

<script>

export default {
    props: {
        resources: {
            type: Object,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentResources: this.resources
        }
    },
    watch: {
        resources: {
            handler(resources) {
                this.currentResources = resources;
            },
            deep: true
        },
        currentResources: {
            handler(resources) {
                // Update the parent component's resources
                this.$emit('update:resources', resources);
                this.$emit('change', resources);
            },
            deep: true
        },
    },
    methods: {
        reset() {
            this.$refs['lumber']?.reset();
            this.$refs['metal']?.reset();
            this.$refs['hide']?.reset();
            this.$refs['arrowvine']?.reset();
            this.$refs['axenut']?.reset();
            this.$refs['corpsecap']?.reset();
            this.$refs['flamefruit']?.reset();
            this.$refs['rockroot']?.reset();
            this.$refs['snowthistle']?.reset();
        }
    }
}
</script>
