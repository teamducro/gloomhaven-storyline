import slugify from 'slugify';

export default {
    methods: {
        slugify: function (string) {
            return slugify(string);
        }
    }
}
