<template>
    <div class="language-switch mdc-select w-full">
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ languages[current] }} {{ flags[current] }}
            </div>
            <span class="mdc-floating-label mdc-floating-label--float-above">{{ $t('Language') }}</span>
            <div class="mdc-line-ripple"></div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class" style="min-width: 240px">
            <div class="mx-1 px-1 mt-4" @click="help">
                <router-link to="/info" class="flex items-center cursor-pointer">
                    <i class="material-icons mdc-list-item__graphic i-text-white2-60"
                       aria-hidden="true">language</i>
                    <span class="mdc-list-item__text text-sm text-white2-87">{{ $t('Help translating?') }}</span>
                </router-link>
            </div>
            <ul class="mdc-list">
                <li v-for="(name, lang) in languages"
                    :key="lang" :data-value="lang"
                    class="mdc-list-item cursor-pointer"
                    :aria-selected="lang === current"
                    :class="{'mdc-list-item--selected': lang === current}">
                    <span class="mr-6">{{ flags[lang] }}</span> {{ name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {loadLanguageAsync} from "../../services/I18n-setup";
import store from "store/dist/store.modern";
import {MDCSelect} from "@material/select/component";

export default {
    data() {
        return {
            current: null,
            languages: {
                'en': 'English',
                'fr': 'Français',
                'it': 'Italiano',
                // 'de': 'Deutsche',
                // 'es': 'Spanish'
            },
            flags: {
                'en': '🇺🇸',
                'fr': '🇫🇷',
                'it': '🇮🇹',
                'de': '🇩🇪',
                'es': '🇪🇸'
            }
        }
    },
    beforeMount() {
        this.setInitialLanguage();
    },
    mounted() {
        this.select = new MDCSelect($('.language-switch')[0]);
        this.select.listen('MDCSelect:change', this.changeLanguage);

        if (this.current !== window.i18n.locale) {
            loadLanguageAsync(this.current);
        }
    },
    destroyed() {
        if (this.select) {
            this.select.destroy();
        }
    },
    methods: {
        changeLanguage() {
            this.current = this.select.value;
            loadLanguageAsync(this.current);
            store.set('lang', this.current);
        },
        setInitialLanguage() {
            let lang = store.get('lang');

            if (!lang) {
                const locale = navigator.language.substring(0, 2);
                if (this.validLanguage(locale)) {
                    lang = locale;
                    store.set('lang', lang);
                }
            }

            this.current = lang || window.i18n.locale;
        },
        validLanguage(lang) {
            return this.languages.hasOwnProperty(lang);
        },
        help() {
            this.$emit('help');
        }
    }
}
</script>

<style scoped lang="scss">
.language-switch {
    .mdc-select__anchor {
        &, &:before, &:after {
            background-color: transparent !important;
        }
    }
}
</style>
