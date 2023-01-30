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
import Helpers from "../../services/Helpers";
import UserRepository from "../../apiRepositories/UserRepository";

export default {
    data() {
        return {
            current: null,
            languages: {
                'en': 'English',
                'fr': 'Français',
                'it': 'Italiano',
                'de': 'Deutsch',
                'es': 'Español',
                'pl': 'Polski'
            },
            flags: {
                'en': '🇺🇸',
                'fr': '🇫🇷',
                'it': '🇮🇹',
                'de': '🇩🇪',
                'es': '🇪🇸',
                'pl': '🇵🇱'
            },
            userRepository: new UserRepository,
        }
    },
    beforeMount() {
        this.setInitialLanguage();
    },
    mounted() {
        console.log('window.i18n.locale', window.i18n.locale);
        if (this.current !== window.i18n.locale) {
            loadLanguageAsync(this.current)
                .then(() => this.updateUserLanguage())
        }

        if (c('.language-switch').length) {
            this.select = new MDCSelect(c('.language-switch')[0]);
            this.select.listen('MDCSelect:change', this.changeLanguage);
        }
    },
    destroyed() {
        this.select?.destroy()
    },
    methods: {
        open() {
            document.querySelector('.language-switch .mdc-select__selected-text').click();
        },
        changeLanguage() {
            this.current = this.select.value;
            loadLanguageAsync(this.current);
            store.set('lang', this.current);
            this.updateUserLanguage();
        },
        getInitialLanguage() {
            let lang = store.get('lang');

            if (!lang) {
                const locale = navigator.language.substring(0, 2);
                if (this.validLanguage(locale)) {
                    lang = locale;
                    store.set('lang', lang);
                }
            }

            return lang;
        },
        setInitialLanguage() {
            this.current = this.getInitialLanguage() || window.i18n.locale;
        },
        validLanguage(lang) {
            return this.languages.hasOwnProperty(lang);
        },
        updateUserLanguage(wait = true) {
            if (Helpers.loggedIn() && typeof app.user?.lang === 'undefined' && wait === true) {
                setTimeout(() => this.updateUserLanguage(false), 500);
            } else if (Helpers.loggedIn() && app.user?.lang !== this.current) {
                app.user.lang = this.current;
                this.userRepository.update(app.user);
            }
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
