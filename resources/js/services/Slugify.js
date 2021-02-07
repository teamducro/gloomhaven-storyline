import slugify from 'slugify';

export default {
    methods: {
        slugify: function (string) {
            if (isNaN(string)) {
                return slugify(string, {lower: true});
            }
            return string;
        }
    }
}
