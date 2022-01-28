export default {
    // We can't use translations outside of vue, it won't be reactive when the language changes.
    // Return the translations key and translate it in vue instead.
    $tPrefix(key) {
        let translationKey = key;

        if (this.translationKey) {
            translationKey = this.translationKey + '.' + translationKey;
        }

        return translationKey;
    }
}
