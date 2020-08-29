<template>
    <transition name="fade">
        <span v-if="this.stack.length > 1" @click="rollback"
              class="material-icons cursor-pointer ml-2">replay</span>
    </transition>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            stack: []
        }
    },
    mounted() {
        this.stack.push(this.value);
    },
    watch: {
        value: function (val) {
            if (val !== this.last()) {
                if (val === this.secondToLast()) {
                    this.stack.pop();
                } else {
                    this.stack.push(val);
                }
            }
        }
    },
    methods: {
        rollback() {
            if (this.stack.length > 1) {
                this.stack.pop();
                let value = this.last();
                this.$emit('update:value', value);
            }
        },
        last() {
            return _.last(this.stack);
        },
        secondToLast() {
            if (this.stack.length > 1) {
                return this.stack[this.stack.length - 2];
            }
        }
    }
}
</script>
