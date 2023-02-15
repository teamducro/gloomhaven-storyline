<template>
    <div class="font-switch mdc-select w-full">
        <div class="mdc-select__anchor w-full">
            <i class="mdc-select__dropdown-icon"></i>
            <div class="mdc-select__selected-text">
                {{ fonts[current] }}
            </div>
            <span class="mdc-floating-label mdc-floating-label--float-above">{{ $t('Font') }}</span>
            <div class="mdc-line-ripple"></div>
        </div>

        <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class" style="min-width: 240px">
            <ul class="mdc-list">
                <li v-for="(name, font) in fonts"
                    :key="font" :data-value="font"
                    class="mdc-list-item cursor-pointer"
                    :style="{'font-family': font}"
                    :aria-selected="font === current"
                    :class="{'mdc-list-item--selected': font === current}">{{ name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import store from "store/dist/store.modern";
import {MDCSelect} from "@material/select/component";
import Helpers from "../../services/Helpers";
import UserRepository from "../../apiRepositories/UserRepository";

export default {
    data() {
        return {
            default_font: 'Nyala',
            current: null,
            fonts: {
                'Nyala': 'Nyala',
                'Pirata One': 'Pirata One',
                'sans-serif': 'Sans Serif',
                'Arial': 'Arial',
                'Calibri': 'Calibri'
            },
            userRepository: new UserRepository,
        }
    },
    beforeMount() {
        this.init();
    },
    mounted() {
        if (this.current !== store.get('font')) {
            this.updateUserFont();
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
            console.log('this.select.value', this.select.value);
            this.current = this.select.value;
            console.log('changeFont', this.current);
            store.set('font', this.current);
            this.updateUserFont();
        },
        getFont() {
            this.init();
            return store.get('font');
        },
        getInitialFont() {
            let font = store.get('font');
            console.log('initial font', font);
            if (!font) {
                const default_font = this.default_font;
                if (this.validFont(default_font)) {
                    console.log('set initial font', default_font);
                    store.set('font', default_font);
                }
            }
            return font;
        },
        init() {
            console.log('this.current', this.current);
            const initial_font = this.getInitialFont();
            if (this.current != initial_font) {
                this.current = initial_font;
                this.updateUserFont();
            }
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
            this.rerender();
        },
        rerender() {
            const stylesheet = document.styleSheets[1];

            const css_class_selectors = ['html, body', 'h1, h2, h3', '.font-title', '.font-default','div[class*="mdc-"]', '#storyline text', '.bedge'];

            css_class_selectors.forEach(selector => {
                console.log('selector', selector);
                const cssRule = [...stylesheet.cssRules].find((r) => r.selectorText === selector)
                if (cssRule) {
                    cssRule.style.setProperty('font-family', this.current, 'important');
                }

                console.log('selector', selector);
            });
        },
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
