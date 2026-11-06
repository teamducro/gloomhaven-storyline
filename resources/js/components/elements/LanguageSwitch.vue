<template>
    <div class="language-switch mdc-select mdc-select--filled w-full">
        <div class="mdc-select__anchor w-full" role="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="mdc-select__ripple"></span>
            <span class="mdc-select__selected-text-container">
                <span class="mdc-select__selected-text">
                    {{ languages[current] }} {{ flags[current] }}
                </span>
            </span>
            <select-dropdown-icon></select-dropdown-icon>
            <span class="mdc-floating-label mdc-floating-label--float-above">{{ $t('Language') }}</span>
            <div class="mdc-line-ripple"></div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class">
            <ul class="mdc-deprecated-list" role="listbox">
                <li role="option" v-for="(name, lang) in languages"
                    :key="lang" :data-value="lang"
                    class="mdc-deprecated-list-item cursor-pointer"
                    :aria-selected="lang === current"
                    :class="{'mdc-deprecated-list-item--selected': lang === current}">
                    <span class="mdc-deprecated-list-item__ripple"></span>
                    <span class="mdc-deprecated-list-item__text"><span class="mr-6">{{ flags[lang] }}</span> {{ name }}</span>
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
                'pl': 'Polski',
                'ru': 'Pусский',
                'hu': 'Magyar',
                'pt': 'Português (Brasil)', // pt-br
            },
            flags: {
                'en': '🇺🇸',
                'fr': '🇫🇷',
                'it': '🇮🇹',
                'de': '🇩🇪',
                'es': '🇪🇸',
                'pl': '🇵🇱',
                'ru': '🇷🇺',
                'hu': '🇭🇺',
                'pt': '🇧🇷', // pt-br
            },
            userRepository: new UserRepository,
        }
    },
    beforeMount() {
        this.setInitialLanguage();
    },
    mounted() {
        if (this.current !== window.i18n.locale) {
            loadLanguageAsync(this.current)
                .then(() => this.updateUserLanguage())
        }

        if (c('.language-switch').length) {
            this.select = new MDCSelect(c('.language-switch')[0]);
            this.select.listen('MDCSelect:change', this.changeLanguage);
        }
    },
    unmounted() {
        this.select?.destroy()
    },
    methods: {
        open() {
            document.querySelector('.language-switch .mdc-select__anchor').click();
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
            } else if (Helpers.loggedIn() && app.user && app.user.lang !== this.current) {
                app.user.lang = this.current;
                this.userRepository.update(app.user);
            }
        }
    }
}
</script>
