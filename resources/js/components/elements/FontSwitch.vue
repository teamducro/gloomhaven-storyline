<template>
    <div>
        <div ref="font-switch" class="font-switch mdc-select mdc-select--filled w-full mb-4">
            <div class="mdc-select__anchor w-full" role="button" aria-haspopup="listbox" aria-expanded="false">
                <span class="mdc-select__ripple"></span>
                <span class="mdc-select__selected-text-container">
                    <span class="mdc-select__selected-text">
                        {{ fonts[settings.current] }}
                    </span>
                </span>
                <select-dropdown-icon></select-dropdown-icon>
                <span class="mdc-floating-label mdc-floating-label--float-above">{{ $t('Font') }}</span>
                <div class="mdc-line-ripple"></div>
            </div>

            <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class" style="min-width: 240px">
                <ul class="mdc-deprecated-list" role="listbox">
                    <li role="option" v-for="(name, font) in fonts"
                        :key="font" :data-value="font"
                        class="mdc-deprecated-list-item cursor-pointer"
                        :style="{'font-family': font}"
                        :aria-selected="font === settings.current"
                        :class="{'mdc-deprecated-list-item--selected': font === settings.current}"><span class="mdc-deprecated-list-item__ripple"></span><span class="mdc-deprecated-list-item__text">{{ name }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <checkbox-with-label id="font-apply-headers"
                             :label="$t('Apply font to headers')"
                             v-model:checked="settings.headers"
                             :auto-disable="false"
                             @change="changeFont"/>
        <checkbox-with-label id="font-apply-storyline"
                             :label="$t('Apply font to storyline')"
                             v-model:checked="settings.storyline"
                             :auto-disable="false"
                             @change="changeFont"/>
    </div>
</template>

<script>

import store from "store/dist/store.modern";
import {MDCSelect} from "@material/select/component";

export default {
    data() {
        return {
            defaultFont: 'Nyala',
            settings: {
                current: 'Nyala',
                headers: false,
                storyline: false
            },
            fonts: {
                'Nyala': 'Nyala',
                'Pirata One': 'Pirata One',
                'sans-serif': 'Sans Serif',
                'Arial': 'Arial',
                'Calibri': 'Calibri',
                'Moyenage': 'Moyenage'
            }
        }
    },
    beforeMount() {
        this.init();
    },
    mounted() {
        this.select = new MDCSelect(this.$refs['font-switch']);
        this.select.listen('MDCSelect:change', this.changeFont);
    },
    unmounted() {
        this.select?.destroy()
    },
    methods: {
        open() {
            document.querySelector('.font-switch .mdc-select__anchor').click();
        },
        changeFont() {
            const font = this.select.value;

            // Ignore invalid fonts
            if (!this.validateFont(font)) {
                return;
            }

            // Apply font and store it in local storage
            this.settings.current = font;
            store.set('font', this.settings);
            this.rerender();
        },
        getFont() {
            this.init();
            return this.settings;
        },
        getInitialFont() {
            let fontSettings = store.get('font');

            // Apply font settings from local storage
            if (typeof fontSettings === 'object') {
                this.settings = fontSettings;
            }
            // Otherwise use default font settings
            else {
                this.settings.current = this.defaultFont;
                store.set('font', this.settings);
            }

            return this.settings.current;
        },
        init() {
            const initialFont = this.getInitialFont();
            if (this.settings.current != initialFont) {
                this.settings.current = initialFont;
            }
            this.rerender();
        },
        validateFont(font) {
            return this.fonts.hasOwnProperty(font);
        },
        rerender() {
            const stylesheet = [...document.styleSheets].find(sheet => sheet.href?.includes('/css/app.css'));
            const titleFont = 'Pirata One';

            const cssSelectors = ['html, body', '.font-title', '.font-default', 'div[class*="mdc-"]', 'h1, h2, h3', '#storyline text'];
            const cssSelectorsWithFonts = Object.fromEntries(cssSelectors.map(selector => [selector, this.settings.current]));

            if (!this.settings.headers) {
                cssSelectorsWithFonts['h1, h2, h3'] = titleFont;
                cssSelectorsWithFonts['.font-title'] = titleFont;
            }

            if (!this.settings.storyline) {
                cssSelectorsWithFonts['#storyline text'] = titleFont;
            }

            for (let [selector, font] of Object.entries(cssSelectorsWithFonts)) {
                const cssRule = [...stylesheet.cssRules].find((r) => r.selectorText === selector)
                if (cssRule) {
                    cssRule.style.setProperty('font-family', font, 'important');
                }
            };
        },
    }
}
</script>

