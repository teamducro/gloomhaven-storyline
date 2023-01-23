<template>
    <div class="font-switch mdc-select w-full">
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ fonts[current] }}
                <!-- {{ fonts['Pirata One'] }}
                {{ current }} -->
            </div>
            <span class="mdc-floating-label mdc-floating-label--float-above">{{ $t('Font') }}</span>
            <div class="mdc-line-ripple"></div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class" style="min-width: 240px">
            <ul class="mdc-list">
                <li v-for="(name, font) in fonts"
                    :key="font" :data-value="font"
                    class="mdc-list-item cursor-pointer"
                    :aria-selected="font === current"
                    :class="{'mdc-list-item--selected': font === current}">{{ name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
// TODO - Asses service worker and font loading
// import {loadLanguageAsync} from "../../services/I18n-setup";
import {loadFontAsync} from "../../services/Fonts";

import store from "store/dist/store.modern";
import {MDCSelect} from "@material/select/component";
import Helpers from "../../services/Helpers";
import UserRepository from "../../apiRepositories/UserRepository";

export default {
    data() {
        return {
            default_font: 'Pirata One',
            current: null,
            fonts: {
                'Pirata One': 'Pirata One',
                'Nyala': 'Nyala',
                'sans-serif': 'Sans Serif',
                'Arial': 'Arial',
                'Calibri': 'Calibri'
            },
            userRepository: new UserRepository,
        }
    },
    beforeMount() {
        this.setInitialFont();

    },
    mounted() {
        console.log('default font');
        if (this.current !== this.default_font) {
            loadFontAsync(this.current)
                .then(() => this.updateUserFont())
        }

        if (c('.font-switch').length) {
            this.select = new MDCSelect(c('.font-switch')[0]);
            this.select.listen('MDCSelect:change', this.changeFont);
        }
    },
    destroyed() {
        this.select?.destroy()
    },
    methods: {
        open() {
            document.querySelector('.font-switch .mdc-select__selected-text').click();
        },
        changeFont() {
            this.current = this.select.value;
            loadFontAsync(this.current);
            store.set('font', this.current);
            this.updateUserFont();
        },
        getInitialFont() {
            let font = store.get('font');

            if (!font) {
                const locale = navigator.font.substring(0, 2);
                if (this.validFont(locale)) {
                    font = locale;
                    store.set('font', font);
                }
            }

            return font;
        },
        setInitialFont() {
            this.current = this.getInitialFont() || window.i18n.locale;
        },
        validFont(font) {
            return this.fonts.hasOwnProperty(font);
        },
        updateUserFont(wait = true) {
            if (Helpers.loggedIn() && typeof app.user?.font === 'undefined' && wait === true) {
                setTimeout(() => this.updateUserFont(false), 500);
            } else if (Helpers.loggedIn() && app.user?.font !== this.current) {
                app.user.font = this.current;
                this.userRepository.update(app.user);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.font-switch {
    .mdc-select__anchor {
        &, &:before, &:after {
            background-color: transparent !important;
        }
    }
}
</style>
