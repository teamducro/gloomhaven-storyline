<template>
    <div>
        <template v-for="(card, index) in cards">
            <button class="mdc-button normal-case -ml-2"
                    @click="toggle(index)">
                <span class="mdc-button__label font-title text-white">{{ card.title }}</span>
                <i class="material-icons mdc-button__icon transform transition-transform duration-500 text-white"
                   :class="{'rotate-0': expand[index], 'rotate-180': !expand[index]}">
                    keyboard_arrow_up
                </i>
            </button>
            <transition-expand>
                <div v-if="expand[index]">
                    <webp v-for="(image, index) in card.images"
                          :key="card.id + '-' + index"
                          :src="image"
                          class="mb-4"
                          :alt="card.title"/>
                </div>
            </transition-expand>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        cards: {
            type: Object
        }
    },
    data() {
        return {
            expand: []
        }
    },
    watch: {
        cards: function (cards) {
            this.expand = new Array(cards.count());
        }
    },
    methods: {
        toggle(index) {
            this.$set(this.expand, index, !this.expand[index]);
        },
    }
}
</script>
