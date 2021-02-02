<template>
    <div>
        <modal ref="modal" :title="item ? item.number : ''">
            <div slot="content" class="w-full h-full flex outline-none">

                <div class="flex-1 mr-3">
                    <webp v-if="item"
                          :src="item.image"
                          :alt="item.name"
                          class="w-full rounded-lg sm:rounded-xl" style="max-width: 400px;"/>
                </div>

                <div class="flex-1 space-y-2">
                    <p v-if="item.source">
                        <span class="relative w-6 h-4 inline-block">
                            <span class="material-icons absolute">info_outline</span>
                        </span>
                        {{ item.source }}
                    </p>
                    <p v-if="item.faq">
                        <span class="relative w-6 h-4 inline-block">
                            <span class="material-icons absolute">help_outline</span>
                        </span>
                        {{ item.faq }}
                    </p>
                </div>
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
