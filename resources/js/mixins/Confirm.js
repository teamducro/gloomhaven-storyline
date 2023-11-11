export default {
    methods: {
        confirm(title, message = null, callback = null, note = null) {
            let args = typeof title === 'object' ? title
                : {title, message, note, callback};

            this.$bus.$emit('open-confirm', args);
        }
    }
}
