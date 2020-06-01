<template>
    <div>
        <button type="button" @click="toggle"
                class="mdc-icon-button material-icons fixed left-0 top-area-inset-top mt-1 p-4 z-5">
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
                            <router-link to="/story" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">dashboard</i>
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

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li @click="toggle">
                            <router-link to="/info" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic"
                                   aria-hidden="true">info</i>
                                <span class="mdc-list-item__text">{{ $t('Info') }}</span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li class="py-4 pl-8">
                            <donate></donate>
                        </li>
                    </ul>
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

    export default {
        data() {
            return {
                drawer: null,
                list: null
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
