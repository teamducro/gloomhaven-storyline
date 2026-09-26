<template>
    <div class="enhancement-sticker absolute flex items-center justify-center"
         :class="{'cursor-move': editable, 'cursor-pointer': !editable}"
         :style="{left: x + '%', top: y + '%'}"
         @pointerdown="startDrag"
         @click="click">
        <img v-if="isNumericBoost" src="/svg/icons/enhancements/plus-one.svg" alt="+1" width="24" height="24"/>
        <enhancement-icon v-else :type="type" :size="24"/>
    </div>
</template>

<script>
import {numericBoostTypes} from "../../services/AbilityEnhancements";

export default {
    props: {
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            default: 75
        },
        y: {
            type: Number,
            default: 10
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isNumericBoost() {
            return numericBoostTypes.includes(this.type);
        }
    },
    methods: {
        startDrag(event) {
            if (!this.editable) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const container = this.$el.parentElement;
            event.target.setPointerCapture(event.pointerId);

            const move = (moveEvent) => {
                const rect = container.getBoundingClientRect();
                const x = this.clamp(((moveEvent.clientX - rect.left) / rect.width) * 100);
                const y = this.clamp(((moveEvent.clientY - rect.top) / rect.height) * 100);
                this.$emit('drag', this.id, x, y);
            };

            const stop = (upEvent) => {
                move(upEvent);
                event.target.removeEventListener('pointermove', move);
                event.target.removeEventListener('pointerup', stop);
                this.$emit('reposition', this.id);
            };

            event.target.addEventListener('pointermove', move);
            event.target.addEventListener('pointerup', stop);
        },
        clamp(value) {
            return Math.min(100, Math.max(0, value));
        },
        click(event) {
            if (this.editable) {
                event.stopPropagation();
            }
            this.$emit('click', this.id);
        }
    }
}
</script>

<style scoped lang="scss">
.enhancement-sticker {
    width: 44px;
    height: 44px;
    margin-left: -22px;
    margin-top: -22px;
    touch-action: none;
}
</style>
