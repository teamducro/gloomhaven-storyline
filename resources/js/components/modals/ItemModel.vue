<template>
    <div>
        <modal ref="modal" :title="item ? item.number : ''" max-width="450px">
            <div slot="content" class="w-full h-full outline-none">
                <webp v-if="item"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full rounded-3xl" style="max-width: 400px;"/>

                <p class="mt-2" v-if="item.faq">
                    <span class="relative w-6 h-4 inline-block">
                        <span class="material-icons absolute">help_outline</span>
                    </span>
                    {{ item.faq }}
                </p>
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
