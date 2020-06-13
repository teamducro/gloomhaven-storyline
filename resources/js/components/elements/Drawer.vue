<template>
    <div>
        <button type="button" @click="toggle"
                class="mdc-icon-button material-icons mdc-button--raised fixed left-0 top-area-inset-top mt-1 p-2 mt-2 ml-2 z-5 i-bg-black2-50 rounded-full">
            menu
        </button>

        <aside ref="menu" class="mdc-drawer mdc-drawer--modal">
            <div class="mdc-drawer__header">
                <webp class="w-3/4 mt-4" alt="Gloomhaven" src="/img/gloomhaven-logo.png"/>
            </div>
            <div class="mdc-drawer__content">
                <div class="mdc-list-group">
                    <ul ref="list" class="mdc-list">
                        <li @click="toggle">
                            <router-link to="/campaigns" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic"
                                   aria-hidden="true">supervisor_account</i>
                                <template v-if="loggedIn">
                                    <span class="mdc-list-item__text">{{ $t('Campaigns') }}</span>
                                </template>
                                <template v-else>
                                    <span class="mdc-list-item__text">{{ $t('Paid version') }}
                                        <span class="ml-2 text-gold font-bold">{{ $t('PRO') }}</span>
                                    </span>
                                </template>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li @click="toggle">
                            <router-link to="/story" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <inline-svg src="icons/story" class="mdc-list-item__graphic" aria-hidden="true"/>
                                <span class="mdc-list-item__text">{{ $t('Storyline') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/map" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">map</i>
                                <span class="mdc-list-item__text">{{ $t('Map') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/scenarios" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">list</i>
                                <span class="mdc-list-item__text">{{ $t('Scenario list') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/achievements" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">emoji_events</i>
                                <span class="mdc-list-item__text">{{ $t('Achievements') }}</span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>
                    </ul>
                </div>
                <div class="mdc-list-group">
                    <ul>
                        <li>
                            <a class="mdc-list-item" @click="$bus.$emit('open-share-modal')">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">share</i>
                                <span class="mdc-list-item__text">{{ $t('Share') }}</span>
                            </a>
                        </li>

                        <li>
                            <a class="mdc-list-item" @click="$bus.$emit('open-reset-modal')">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">delete_forever</i>
                                <span class="mdc-list-item__text">{{ $t('Reset') }}</span>
                            </a>
                        </li>

                        <li @click="toggle">
                            <router-link to="/info" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic"
                                   aria-hidden="true">info</i>
                                <span class="mdc-list-item__text">{{ $t('Info') }}</span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li class="py-4 w-full" @click="toggle">
                            <router-link to="/campaigns" class="flex justify-center -ml-6">
                                <button class="relative text-light-gray py-1 pl-3 pr-8 border border-light-gray border-solid rounded-full"
                                        type="submit">
                                    {{ $t('Remove ads') }}
                                    <span class="absolute top-0 right-0 -mt-2 -mr-6 bg-black text-2xl h-12 w-12 leading-12 border-2 border-light-gray border-solid rounded-full">🎉</span>
                                </button>
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="lgh:absolute lgh:bottom-0 m-2" style="width: calc(100% - 1em);">
                    <language-switch></language-switch>
                </div>
            </div>
        </aside>

        <div class="mdc-drawer-scrim"></div>

        <div class="mdc-drawer-app-content w-full">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    import {MDCDrawer} from "@material/drawer/component";
    import Helpers from "../../services/Helpers";

    export default {
        data() {
            return {
                drawer: null,
                list: null,
                loggedIn: Helpers.loggedIn()
            }
        },
        mounted() {
            this.drawer = MDCDrawer.attachTo(this.$refs['menu']);
        },
        methods: {
            toggle() {
                this.drawer.open = !this.drawer.open;
            }
        }
    }
</script>
