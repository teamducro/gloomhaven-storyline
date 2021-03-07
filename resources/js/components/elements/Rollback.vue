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
            default: 0
        }
    },
    data() {
        return {
            current: null,
            stack: [],
            rollingBack: false
        }
    },
    watch: {
        value: {
            handler(val) {
                this.set(val);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        reset() {
            this.stack = [];
            this.push(this.value);
        },
        set(value) {
            this.current = value;
            if (JSON.stringify(value) !== JSON.stringify(this.last()) && !this.rollingBack) {
                if (value === this.secondToLast()) {
                    this.pop();
                } else {
                    this.push(value);
                }
            }
        },
        pop() {
            this.stack.pop();
        },
        push(value) {
            this.stack.push(this.isObject(value) ? Object.assign({}, value) : value);
        },
        rollback() {
            if (this.stack.length > 1) {
                this.rollingBack = true;

                this.pop();
                let value;
                if (this.isObject(this.last())) {
                    value = Object.assign(this.current, this.last());
                } else {
                    value = this.last();
                }
                this.$emit('update:value', value);
                this.$emit('change', value);

                setTimeout(() => {
                    this.rollingBack = false;
                }, 0);
            }
        },
        isObject(val) {
            return (typeof val === 'object' && val !== null);
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
