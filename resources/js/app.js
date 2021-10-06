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
import EchoService from "./services/app/EchoService";
import VueScrollTo from "vue-scrollto";
import StorySyncer from "./services/StorySyncer";
import OfflineChecker from "./services/app/OfflineChecker";
import ItemRepository from "./repositories/ItemRepository";
import * as Sentry from "@sentry/vue";
import {Integrations} from "@sentry/tracing";
import migrateVersion1Progress from "./services/app/migrateVersion1Progress";
import migrateVersion2Progress from "./services/app/migrateVersion2Progress";
import isWebpSupported from "./services/app/isWebpSupported";
import listenToCrtlS from "./services/app/listenToCrtlS";
import checkHasMouse from "./services/app/checkHasMouse";
import checkOrientation from "./services/app/checkOrientation";
import polyfills from "./services/app/polyfills";
import dayjs from "dayjs";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import TreasureValidator from "./services/TreasureValidator";
import Vue from 'vue';

window._ = require('lodash');
window.c = require('cash-dom');
window.Vue = Vue;
window.collect = require('collect.js');
window.axios = require('axios').default.create({
    baseURL: process.env.MIX_API_URL,
    withCredentials: true
});
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

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
            game: 'gh',
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
            treasureValidator: new TreasureValidator,
            storySyncer: new StorySyncer,
            offlineChecker: new OfflineChecker(this.$bus)
        }
    },
    async mounted() {
        this.beforeBoot();

        await this.loadCampaignData(true);
        await this.$nextTick();
        await this.campaignsChanged();

        (new ShareState).loadOldLink();

        document.getElementById('bg').style['background-image'] = "url('/img/background-highres.jpg'), url('/img/background-lowres.jpg')";

        this.$bus.$on('game-selected', this.switchGame);
        this.$bus.$on('campaign-selected', this.switchCampaign);
        this.$bus.$on('load-campaign-data', this.loadCampaignData);

        Vue.prototype.$stripe = await loadStripe(process.env.MIX_STRIPE_KEY);

        this.$bus.$emit('open-donations');

        listenToCrtlS();
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
            this.achievements = this.achievementRepository.fetch(this.game);
            await this.$nextTick();
            this.$bus.$emit('achievements-updated');

            return true;
        },
        async fetchScenarios(shouldSync = true) {
            this.quests = this.questRepository.fetch(this.game);
            this.scenarios = this.scenarioRepository.fetch(this.game);
            this.scenarioRepository.setQuests(this.scenarios, this.quests);

            await this.$nextTick();
            this.scenarioValidator.validate(shouldSync);
            this.treasureValidator.validate();
            this.$bus.$emit('scenarios-updated');

            return true;
        },
        async fetchItems() {
            this.items = this.itemRepository.fetch(this.game);
            await this.$nextTick();
            this.$bus.$emit('items-updated');

            return true;
        },
        switchLocal(campaignId = 'local') {
            this.campaignId = campaignId;
            store.set('campaignId', this.campaignId);
        },
        async switchGame(game) {
            this.game = game;
            store.set('game', game);
            await this.switchCampaign(this.campaignId);
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
            this.campaignData = migrateVersion2Progress(this.campaignData);
            this.game = store.get('game') || 'gh';
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
        beforeBoot() {
            polyfills();
            this.$bus.$on('orientation-changed', (isPortrait) => this.isPortrait = isPortrait);
            this.$bus.$on('has-mouse', (hasMouse) => this.hasMouse = hasMouse);
            checkOrientation(this.$bus);
            this.offlineChecker.handle();
            this.webpSupported = isWebpSupported();
            checkHasMouse(this.$bus);
            migrateVersion1Progress();
        }
    }
});
