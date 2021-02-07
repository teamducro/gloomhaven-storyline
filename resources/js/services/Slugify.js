import slugify from 'slugify';

export default {
    methods: {
        slugify: function (string) {
            return slugify(String.toString(string), {lower: true});
        }
    }
}
