import ScenarioRepository from "./repositories/ScenarioRepository";
import ScenarioValidator from "./services/ScenarioValidator";
import SocialSharing from 'vue-social-sharing';
import VueClipboard from 'vue-clipboard2';
import ShareState from "./services/ShareState";
import QuestRepository from "./repositories/QuestRepository";
import VueRouter from 'vue-router'
import Story from "./components/Story";
import Scenarios from "./components/Scenarios";

window._ = require('lodash');
window.$ = require('jquery');
window.Vue = require('vue');
window.collect = require('collect.js');
window.Vue.use(SocialSharing);
VueClipboard.config.autoSetContainer = true;
window.Vue.use(VueClipboard);

const files = require.context('./components', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

const routes = [
    {path: '/', redirect: '/story'},
    {path: '/story', component: Story},
    {path: '/scenarios', component: Scenarios}
];
const router = new VueRouter({routes});

Vue.prototype.$bus = new Vue;
Vue.use(VueRouter);
window.app = new Vue({
    router,
    el: '#app',
    data() {
        return {
            scenarios: null,
            quests: null,
            webpSupported: true,
            hasMouse: false,
            isPortrait: true
        }
    },
    mounted() {
        this.fetchScenarios();
        this.webpSupported = this.isWebpSupported();
        this.hasMouse = this.checkHasMouse();
        this.checkOrientation();
        document.getElementsByTagName('body')[0].style['background-image'] = "url('/img/background-highres.jpg'), url('/img/background-lowres.jpg')";
    },
    methods: {
        fetchScenarios() {
            let scenarioRepository = new ScenarioRepository;
            let questRepository = new QuestRepository;
            this.quests = questRepository.fetch();
            this.scenarios = scenarioRepository.fetch();
            scenarioRepository.setQuests(this.scenarios, this.quests);

            this.$nextTick(() => {
                (new ShareState).load();
                (new ScenarioValidator).validate();
                this.$bus.$emit('scenarios-updated');
            });
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
            }, 300));
        }
    }
});
