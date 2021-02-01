<template>
    <div>
        <modal ref="modal" :title="item ? item.name : ''" max-width="450px">
            <div slot="content" class="w-full h-full outline-none">
                <webp v-if="item"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full rounded-3xl" style="max-width: 400px;"/>
            </div>
        </modal>
    </div>
</template>

<script>
import panzoom from "panzoom"

export default {
    props: {
        item: {
            type: Object,
            default: null
        },
    },
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        open() {
            this.$refs['modal'].open();
        }
    }
}
</script>
