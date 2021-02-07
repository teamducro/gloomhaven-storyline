import ScenarioRepository from "./repositories/ScenarioRepository";
import ScenarioValidator from "./services/ScenarioValidator";
import SocialSharing from 'vue-social-sharing';
import VueClipboard from 'vue-clipboard2';
import ShareState from "./services/ShareState";
import QuestRepository from "./repositories/QuestRepository";
import AchievementRepository from "./repositories/AchievementRepository";
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import VueAnalytics from 'vue-analytics';
import i18nEn from "./lang/en";
import Helpers from './services/Helpers';
import store from "store/dist/store.modern";
import UserRepository from "./apiRepositories/UserRepository";
import StoryRepository from "./apiRepositories/StoryRepository";
import {loadStripe} from '@stripe/stripe-js/pure';
import EchoService from "./services/EchoService";
import VueScrollTo from "vue-scrollto";
import StorySyncer from "./services/StorySyncer";
import OfflineChecker from "./services/OfflineChecker";
import ItemRepository from "./repositories/ItemRepository";
import * as Sentry from "@sentry/vue";
import {Integrations} from "@sentry/tracing";

window._ = require('lodash');
window.$ = require('jquery');
window.Vue = require('vue');
window.collect = require('collect.js');
window.axios = require('axios').default.create({
    baseURL: process.env.MIX_API_URL,
    withCredentials: true
});

Vue.use(SocialSharing);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(VueScrollTo);

// Vue components
const components = require.context('./components', true, /\.vue$/i);
components.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], components(key).default));

// Router
const routes = require('./routes').default;
const router = new VueRouter({routes});
Vue.use(VueRouter);

// Analytics
if (Helpers.inProduction() && process.env.MIX_GA_ID) {
    Vue.use(VueAnalytics, {
        id: process.env.MIX_GA_ID,
        router
    });
}

if (Helpers.inProduction() && process.env.MIX_SENTRY_DSN) {
    Sentry.init({
        Vue: window.Vue,
        dsn: process.env.MIX_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0,
        logErrors: false
    });
}

// Multi Language
Vue.use(VueI18n);
window.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: i18nEn
    },
    silentTranslationWarn: true
});

// event bus
Vue.prototype.$bus = new Vue;

window.app = new Vue({
    i18n,
    router,
    el: '#app',
    data() {
        return {
            scenarios: null,
            quests: null,
            achievements: null,
            items: null,
            webpSupported: true,
            hasMouse: false,
            isPortrait: true,
            user: null,
            stories: collect(),
            campaignId: 'local',
            campaignData: {},

            scenarioRepository: new ScenarioRepository,
            questRepository: new QuestRepository,
            achievementRepository: new AchievementRepository,
            itemRepository: new ItemRepository,
            userRepository: new UserRepository,
            storyRepository: new StoryRepository,
            echo: new EchoService,
            scenarioValidator: new ScenarioValidator,
            storySyncer: new StorySyncer,
            offlineChecker: new OfflineChecker(this.$bus)
        }
    },
    async mounted() {
        this.checkOrientation();
        this.offlineChecker.handle();
        this.webpSupported = this.isWebpSupported();
        this.hasMouse = this.checkHasMouse();
        this.shouldTransferVersion1Progress();

        await this.loadCampaignData(true);
        await this.$nextTick();
        await this.campaignsChanged();

        (new ShareState).loadOldLink();

        document.getElementById('bg').style['background-image'] = "url('/img/background-highres.jpg'), url('/img/background-lowres.jpg')";

        this.$bus.$on('campaign-selected', this.switchCampaign);
        this.$bus.$on('load-campaign-data', this.loadCampaignData);

        Vue.prototype.$stripe = await loadStripe(process.env.MIX_STRIPE_KEY);

        this.$bus.$emit('open-donations');

        this.listenToCrtlS();
    },
    methods: {
        async campaignsChanged(shouldSync = true) {
            await Promise.all([
                this.fetchAchievements(),
                this.fetchScenarios(shouldSync),
                this.fetchItems(),
            ]);

            this.$bus.$emit('campaigns-changed');
        },
        async fetchAchievements() {
            this.achievements = this.achievementRepository.fetch();
            await this.$nextTick();
            this.$bus.$emit('achievements-updated');

            return true;
        },
        async fetchScenarios(shouldSync = true) {
            this.quests = this.questRepository.fetch();
            this.scenarios = this.scenarioRepository.fetch();
            this.scenarioRepository.setQuests(this.scenarios, this.quests);

            await this.$nextTick();
            this.scenarioValidator.validate(shouldSync);
            this.$bus.$emit('scenarios-updated');

            return true;
        },
        async fetchItems() {
            this.items = this.itemRepository.fetch();
            await this.$nextTick();
            this.$bus.$emit('items-updated');

            return true;
        },
        switchLocal(campaignId = 'local') {
            this.campaignId = campaignId;
            store.set('campaignId', this.campaignId);
        },
        async switchCampaign(campaignId, shouldFetch = false) {
            this.campaignId = campaignId;
            store.set('campaignId', this.campaignId);
            await this.loadCampaignData(shouldFetch);
            await this.campaignsChanged();
        },
        async loadCampaignData(shouldFetch = false) {
            this.campaignId = store.get('campaignId') || 'local';

            if (shouldFetch) {
                await this.fetchCampaignData();
            }

            this.campaignData = store.get(this.campaignId) || {};
            this.stories = this.storyRepository.getStories();
            if (Helpers.loggedIn()) {
                this.user = this.userRepository.getUser();
            }

            this.stories.each(story => {
                this.echo.listen(story, async newStory => {
                    this.storyRepository.replaceStory(newStory);
                    await this.loadCampaignData();
                    await this.campaignsChanged(false);
                });
            });
        },
        async fetchCampaignData() {
            try {
                let promises = [
                    this.storyRepository.sharedStories()
                ];

                if (Helpers.loggedIn()) {
                    promises.push(this.userRepository.find());
                    promises.push(this.storyRepository.stories());
                }

                await Promise.all(promises);
            } catch (e) {
                // offline
            }
        },
        isWebpSupported() {
            let elem = document.createElement('canvas');

            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }

            return false;
        },
        checkHasMouse() {
            $('body').one('touchstart.test', (e) => {
                $('body').off('mousemove.test');
            }).one('mousemove.test', (e) => {
                this.hasMouse = true;
                this.$bus.$emit('scenarios-updated');
            });
        },
        checkOrientation() {
            this.isPortrait = window.matchMedia("(orientation: portrait)").matches;

            window.addEventListener('resize', _.debounce(() => {
                this.isPortrait = window.matchMedia("(orientation: portrait)").matches;
                this.$bus.$emit('orientation-changed', this.isPortrait);
                this.$bus.$emit('windows-resized');

                this.updateViewportHeight();
            }, 300));
            this.$bus.$emit('orientation-changed', this.isPortrait);
            this.updateViewportHeight();
        },
        updateViewportHeight() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        },
        shouldTransferVersion1Progress() {
            if (!store.get('scenario-1')) {
                return;
            }

            const items = {...localStorage};

            // fetch old campaign progress.
            let local = {};
            for (const [key, value] of Object.entries(items)) {
                if (key.startsWith('scenario') || key.startsWith('achievement')) {
                    local[key] = JSON.parse(value);
                }
            }

            // store campaign progress at new location.
            store.set('local', local);

            // remove old campaign progress.
            Object.keys(local).forEach(key => {
                store.remove(key);
            });
        },

        listenToCrtlS() {
            document.addEventListener('keydown', (e) => {
                if ((Helpers.isMac() ? e.metaKey : e.ctrlKey) && (e.code === 'KeyS')) {
                    e.preventDefault();
                    this.storySyncer.store(true);
                }
            }, false);
        }
    }
});
