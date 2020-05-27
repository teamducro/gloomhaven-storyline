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
import Hammer from 'hammerjs';
import {loadLanguageAsync} from "./services/I18n-setup";
import i18nEn from "./lang/en";
import Helpers from './services/Helpers';

window._ = require('lodash');
window.$ = require('jquery');
window.Vue = require('vue');
window.collect = require('collect.js');
Vue.use(SocialSharing);
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

// Vue components
const components = require.context('./components', true, /\.vue$/i);
components.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], components(key).default));

// pages
const Story = () => import("./pages/Story");
const Scenarios = () => import("./pages/Scenarios");
const Achievements = () => import("./pages/Achievements");
const Map = () => import("./pages/Map");

// Router
const routes = [
    {path: '/', redirect: '/story'},
    {path: '/story', component: Story},
    {path: '/scenarios', component: Scenarios},
    {path: '/map', component: Map},
    {path: '/achievements', component: Achievements},
];
const router = new VueRouter({routes});
Vue.use(VueRouter);

// Directives
Vue.directive("tap", {
    bind: function (el, binding) {
        if (typeof binding.value === "function") {
            const mc = new Hammer(el);
            mc.on("tap", binding.value);
        }
    }
});

// Analytics
if (Helpers.inProduction() && process.env.MIX_GA_ID) {
    Vue.use(VueAnalytics, {
        id: process.env.MIX_GA_ID,
        router
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
            webpSupported: true,
            hasMouse: false,
            isPortrait: true
        }
    },
    async mounted() {
        // loadLanguageAsync('de');
        this.checkOrientation();
        this.webpSupported = this.isWebpSupported();
        this.hasMouse = this.checkHasMouse();

        await Promise.all([
            this.fetchAchievements(),
            this.fetchScenarios()
        ]);

        this.shouldRedirectToDotCom();

        document.getElementsByTagName('body')[0].style['background-image'] = "url('/img/background-highres.jpg'), url('/img/background-lowres.jpg')";

        this.$bus.$emit('open-donations');
    },
    methods: {
        async fetchAchievements() {
            let achievementRepository = new AchievementRepository;
            this.achievements = achievementRepository.fetch();
            await this.$nextTick();
            this.$bus.$emit('achievements-updated');

            return true;
        },
        async fetchScenarios() {
            let scenarioRepository = new ScenarioRepository;
            let questRepository = new QuestRepository;
            this.quests = questRepository.fetch();
            this.scenarios = scenarioRepository.fetch();
            scenarioRepository.setQuests(this.scenarios, this.quests);

            await this.$nextTick();
            (new ShareState).load();
            (new ScenarioValidator).validate();
            this.$bus.$emit('scenarios-updated');

            return true;
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
        shouldRedirectToDotCom() {
            if (window.location.host.endsWith(".danield.nl")) {
                window.location = process.env.MIX_APP_URL + '?' + (new ShareState).encode();
            }
        }
    }
});
