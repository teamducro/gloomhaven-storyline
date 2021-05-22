<template xmlns="http://www.w3.org/1999/html">
    <div>
        <button type="button" @click="toggle"
                class="mdc-icon-button material-icons mdc-button--raised fixed left-0 top-area-inset-top mt-1 p-2 mt-2 ml-2 z-5 i-bg-black2-50 rounded-full">
            menu
        </button>

        <aside ref="menu" class="mdc-drawer mdc-drawer--modal">
            <div class="mdc-drawer__header" style="min-height: 0;">
                <a href="/">
                    <webp class="w-3/4 mt-4" alt="Gloomhaven" src="/img/gloomhaven-logo.png"/>
                </a>
            </div>
            <div class="mdc-drawer__content">
                <div v-if="showCampaignSwitch" class="m-2" style="width: calc(100% - 1em);">
                    <campaign-switch ref="campaign-switch"></campaign-switch>
                </div>
                <div class="mdc-list-group">
                    <!--
                    <div v-if="user" class="mx-4 mb-4 flex items-center">
                        <span class="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-50">
                            <img class="h-full w-full"
                                 :src="gravatar()"/>
                        </span>
                        <div class="text-white2-87 flex-1 ml-4 flex flex-col">
                            <span class="text-lg">{{ user.name }}</span>
                            <span class="text-sm">{{ user.email }}</span>
                        </div>
                    </div>
                    -->

                    <ul ref="list" class="mdc-list">
                        <li @click="toggle">
                            <router-link to="/campaigns" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic"
                                   aria-hidden="true">supervisor_account</i>
                                <span class="mdc-list-item__text">
                                    {{ $t('Campaigns') }}
                                    <span v-if="!user" class="ml-2 text-gold font-bold">{{ $t('PRO') }}</span>
                                </span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li @click="toggle">
                            <router-link to="/story" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <inline-svg src="icons/story" class="mdc-list-item__graphic" aria-hidden="true"/>
                                <span class="mdc-list-item__text">{{ $t('Storyline') }}</span>
                                <button type="button" @click="expandGameSwitch = !expandGameSwitch; preventToggle()"
                                        class="mdc-icon-button material-icons mdc-button--raised transition-transform transform rounded-full ml-auto p-0 i-bg-transparent i-text-white2-87 cursor-pointer"
                                        :class="{'rotate-270': expandGameSwitch, 'rotate-90': !expandGameSwitch}">
                                    play_circle_outline
                                </button>
                            </router-link>
                        </li>

                        <game-switch @click="toggle" v-if="expandGameSwitch"></game-switch>

                        <li @click="toggle">
                            <router-link to="/map" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">map</i>
                                <span class="mdc-list-item__text">{{ $t('Map') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/scenarios" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">list</i>
                                <span class="mdc-list-item__text">{{ $t('Scenario list') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/achievements" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <inline-svg style="width: 16px" src="icons/achievements"
                                            class="mdc-list-item__graphic ml-1"
                                            aria-hidden="true"/>
                                <span class="mdc-list-item__text">{{ $t('Achievements') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/party" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">assignment</i>
                                <span class="mdc-list-item__text">{{ $t('Party sheet') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/items" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic transform rotate-180"
                                   aria-hidden="true">style</i>
                                <span class="mdc-list-item__text">{{ $t('Items') }}</span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>
                    </ul>
                </div>
                <div class="mdc-list-group">
                    <ul>
                        <li>
                            <a class="mdc-list-item"
                               @click="shareCurrentStory">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">share</i>
                                <span class="mdc-list-item__text">{{ $t('Share') }}</span>
                            </a>
                        </li>

                        <li @click="toggle">
                            <router-link to="/settings" class="mdc-list-item"
                                         active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
                                <span class="mdc-list-item__text">{{ $t('Settings') }}</span>
                            </router-link>
                        </li>

                        <li @click="toggle">
                            <router-link to="/info" class="mdc-list-item" active-class="mdc-list-item--activated">
                                <i class="material-icons mdc-list-item__graphic"
                                   aria-hidden="true">info</i>
                                <span class="mdc-list-item__text">{{ $t('Info') }}</span>
                            </router-link>
                        </li>

                        <li role="separator" class="mdc-list-divider i-my-2"></li>

                        <li v-if="!loggedIn" class="py-4 pl-4 w-full" @click="toggle">
                            <donate></donate>
                        </li>
                    </ul>
                </div>
                <div class="m-2" style="width: calc(100% - 1em);">
                    <language-switch @help="toggle"></language-switch>
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
import AuthRepository from "../../apiRepositories/AuthRepository";
import StoryRepository from "../../repositories/StoryRepository";

const md5 = require('js-md5');

export default {
    data() {
        return {
            drawer: null,
            list: null,
            user: null,
            currentRoute: null,
            stopToggle: false,
            expandGameSwitch: false,
            loggedIn: Helpers.loggedIn(),
            showCampaignSwitch: false,
            auth: new AuthRepository(),
            storyRepository: new StoryRepository
        }
    },
    mounted() {
        this.drawer = MDCDrawer.attachTo(this.$refs['menu']);
        this.$bus.$on('campaigns-changed', this.setUser);
    },
    methods: {
        toggle() {
            if (this.stopToggle) {
                return;
            }

            this.drawer.open = !this.drawer.open;
            if (this.drawer.open) {
                this.currentRoute = this.$router.currentRoute.path;
                this.expandGameSwitch = false;
                this.stopToggle = false;

                // load campaign options
                if (this.showCampaignSwitch) {
                    this.$refs['campaign-switch'].applyData();
                }
            }
        },
        preventToggle() {
            this.stopToggle = true;
            setTimeout(() => {
                this.stopToggle = false;
            }, 10);
        },
        async logout() {
            this.auth.logout();
            await app.switchCampaign('local');

            location.reload();
        },
        setUser() {
            this.user = app.user;

            if (this.user && this.shouldOpenShare()) {
                this.shareCurrentStory();
                Helpers.removeQueryString();
            }

            this.showCampaignSwitch = app.stories.count() > 0;
        },
        shouldOpenShare() {
            return location.search.includes('share');
        },
        gravatar() {
            const hash = md5(this.user.email);
            return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
        },
        shareCurrentStory() {
            if (app.campaignId === 'local') {
                this.$bus.$emit('open-share-modal');
            } else {
                this.$bus.$emit('open-share-campaign-code-modal', this.storyRepository.current());
            }
        }
    }
}
</script>

<style scoped lang="scss">
.mdc-drawer__content {
    overflow-x: hidden;
}
</style>
