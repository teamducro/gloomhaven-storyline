<template>
    <transition name="fade">
        <div v-if="show" class="fixed right-0 bottom-0 mr-4 mb-4">
            <alert :success="success">
                {{ message }}
            </alert>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            show: false,
            success: true,
            timer: null
        }
    },
    mounted() {
        this.$bus.$on('toast', this.open)
    },
    destroyed() {
        this.$bus.$off('toast', this.open)
    },
    methods: {
        open(message, isSuccess = true) {
            this.message = message;
            this.success = isSuccess;
            this.show = true;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.show = false;
            }, 5000);
        }
    }
}
</script>
