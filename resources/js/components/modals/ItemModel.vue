<template>
    <div>
        <modal ref="modal" :title="item ? item.name : ''">
            <div slot="content" class="w-full h-full outline-none">
                <webp v-if="item"
                      :src="item.image"
                      :alt="item.name"
                      class="md:w-full rounded-3xl"/>
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
            this.center();
        },
        center() {
            const width = $('#item-zoom img').first().width();
            if (window.innerWidth > width) {
                this.zoom.moveTo((window.innerWidth - width) / 2, 0);
            } else {
                this.zoom.moveTo(0, 0);
            }
        }
    }
}
</script>
