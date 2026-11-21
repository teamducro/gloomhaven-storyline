export default {
    data: function () {
        return {
            baseUrl: import.meta.env.MIX_CDN_URL || ''
        }
    },
}
