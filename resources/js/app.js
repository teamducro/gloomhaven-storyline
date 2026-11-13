import './services/app/globals';
import components from './services/app/components';
import ScenarioRepository from "./repositories/ScenarioRepository";
import ScenarioValidator from "./validators/ScenarioValidator";
import ShareState from "./services/ShareState";
import QuestRepository from "./repositories/QuestRepository";
import AchievementRepository from "./repositories/AchievementRepository";
import {createRouter, createWebHashHistory} from 'vue-router';
import i18nEn from "./lang/en/en";
import Helpers from './services/Helpers';
import store from "store/dist/store.modern";
import UserRepository from "./apiRepositories/UserRepository";
import StoryRepository from "./apiRepositories/StoryRepository";
import {loadStripe} from '@stripe/stripe-js/pure';
import EchoService from "./services/app/EchoService";
import StorySyncer from "./services/StorySyncer";
import OfflineChecker from "./services/app/OfflineChecker";
import ItemRepository from "./repositories/ItemRepository";
import BuildingRepository from "./repositories/BuildingRepository";
import OverlayRepository from "./repositories/OverlayRepository";
import * as Sentry from "@sentry/vue";
import migrateVersion1Progress from "./services/app/migrateVersion1Progress";
import migrateVersion2Progress from "./services/app/migrateVersion2Progress";
import migrateDonationProsperity from "./services/app/migrateDonationProsperity";
import migrateSheets from "./services/app/migrateSheets";
import isWebpSupported from "./services/app/isWebpSupported";
import listenToCrtlS from "./services/app/listenToCrtlS";
import checkHasMouse from "./services/app/checkHasMouse";
import checkOrientation from "./services/app/checkOrientation";
import polyfills from "./services/app/polyfills";
import TreasureValidator from "./validators/TreasureValidator";
import {createApp, markRaw} from 'vue';
import setInitialLanguage from "./services/app/setInitialLanguage";
import {gsap} from "gsap";
import {Flip} from "gsap/Flip.js";
import getEnabledGames from "./services/app/getEnabledGames";
import getFont from "./services/app/getFont";
import BaseUrl from "./mixins/BaseUrl";
import {Game} from "./models/Game";
import GameData from "./services/GameData";
import SheetRepository from "./repositories/SheetRepository";
import enableGame from "./services/app/enableGame";
import registerServiceWorker from "./services/app/RegisterServiceWorker";
import reloadForNewBuild from "./services/app/reloadForNewBuild";
import routes from './routes';
import bus from './services/EventBus';
import createLegacyI18n from './services/createLegacyI18n';
import registerGlobals from './services/app/registerGlobals';
import '../sass/theme.scss';
import '../sass/app.scss';

gsap.registerPlugin(Flip);

const router = createRouter({history: createWebHashHistory(), routes});

window.addEventListener('vite:preloadError', (event) => reloadForNewBuild() && event.preventDefault());
// Chrome, Firefox and Safari messages for a lazy route chunk that failed to load.
router.onError((error) => {
    if (/dynamically imported module|Importing a module script failed/.test(error?.message)) {
        reloadForNewBuild();
    }
    console.error(error);
});

// Router 4 ignores URL changes until its first navigation is done, then overwrites them; follow one made while booting.
const bootHash = location.hash;
const removeBootGuard = router.beforeResolve(() => {
    removeBootGuard();
    if (location.hash !== bootHash) {
        return location.hash.slice(1) || '/';
    }
});

const i18n = createLegacyI18n({en: i18nEn});
window.i18n = i18n.global;

const vueApp = createApp({
    mixins: [BaseUrl],
    provide() {
        const appData = {}

        Object.defineProperty(appData, "game", {
            get: () => this.game,
        })

        Object.defineProperty(appData, "mainGame", {
            get: () => this.mainGame,
        })

        Object.defineProperty(appData, "story", {
            get: () => this.story,
        })

        Object.defineProperty(appData, "hasMouse", {
            get: () => this.hasMouse,
        })

        // This shorthand is needed to use it in vue templates
        Object.defineProperty(appData, "read_only", {
            get: () => this.story?.read_only,
        })

        return {
            appData,
        }
    },
    data() {
        return {
            game: null,
            mainGame: import.meta.env.MIX_MAIN_GAME || Game.gh,
            story: null,
            enabledGames: {},
            scenarios: null,
            quests: null,
            achievements: null,
            items: null,
            buildings: null,
            overlays: null,
            webpSupported: true,
            hasMouse: false,
            isPortrait: true,
            user: null,
            stories: collect(),
            campaignId: 'local',
            campaignData: {},
            font: null,

            // Stateless for the UI: raw, so their reads aren't proxied and tracked
            scenarioRepository: markRaw(new ScenarioRepository),
            questRepository: markRaw(new QuestRepository),
            achievementRepository: markRaw(new AchievementRepository),
            itemRepository: markRaw(new ItemRepository),
            buildingRepository: markRaw(new BuildingRepository),
            overlayRepository: markRaw(new OverlayRepository),
            userRepository: markRaw(new UserRepository),
            storyRepository: markRaw(new StoryRepository),
            echo: markRaw(new EchoService),
            scenarioValidator: markRaw(new ScenarioValidator),
            treasureValidator: markRaw(new TreasureValidator),
            storySyncer: markRaw(new StorySyncer),
            offlineChecker: markRaw(new OfflineChecker(this.$bus))
        }
    },
    async mounted() {
        this.beforeBoot();
        await this.loadCampaignData(true);
        await this.$nextTick();
        await this.campaignsChanged();

        (new ShareState).loadOldLink();

        document.getElementById('bg').style['background-image'] = `url('${this.baseUrl}/img/background-highres.jpg'), url('${this.baseUrl}/img/background-lowres.jpg')`;

        this.$bus.$on('game-selected', this.switchGame);
        this.$bus.$on('campaign-selected', this.switchCampaign);
        this.$bus.$on('load-campaign-data', this.loadCampaignData);

        // Before awaiting Stripe: a blocked or slow Stripe must not keep the saved language from loading.
        setInitialLanguage();

        vueApp.config.globalProperties.$stripe = await loadStripe(import.meta.env.MIX_STRIPE_KEY);

        this.$bus.$emit('open-donations');

        listenToCrtlS();
    },
    methods: {
        async campaignsChanged(shouldSync = true) {
            await Promise.all([
                this.fetchAchievements(),
                this.fetchScenarios(shouldSync),
                this.fetchItems(),
                this.fetchBuildings(),
                this.fetchOverlays(),
            ]);

            this.story = this.stories.firstWhere('campaignId', this.campaignId);
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
            let items = {}
            this.enabledGames.forEach((game) => {
                // FC uses GH items
                if (game !== Game.fc) {
                    items = {...items, ...this.itemRepository.fetch(game).items};
                }
            })
            this.items = collect(items);
            await this.$nextTick();
            this.$bus.$emit('items-updated');

            return true;
        },
        async fetchBuildings() {
            this.buildings = this.buildingRepository.fetch(this.game);
            await this.$nextTick();
            this.$bus.$emit('buildings-updated');

            return true;
        },
        async fetchOverlays() {
            this.overlays = this.overlayRepository.fetch(this.game);
            await this.$nextTick();
            this.$bus.$emit('overlays-updated');

            return true;
        },
        switchLocal(campaignId = 'local') {
            this.campaignId = campaignId;
            store.set('campaignId', this.campaignId);
            this.story = null
        },
        storedGame() {
            const game = store.get('game');
            // A game from another branch/release may not exist in this build
            if (game && !new GameData().validate(game)) {
                store.set('game', this.mainGame);
                return this.mainGame;
            }

            return game || this.mainGame;
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

            const stored = store.get(this.campaignId) || {};
            const loaded = JSON.stringify(stored);
            this.campaignData = migrateVersion2Progress(stored);
            this.campaignData = migrateDonationProsperity(this.campaignId, this.campaignData);
            migrateSheets(this.campaignData);
            // Crossover defaults depend on the campaign (MP classes in use)
            this.enabledGames = getEnabledGames();
            this.game = this.storedGame();
            const gloomhavenGame = (new SheetRepository).gloomhavenGame();
            if ([Game.gh, Game.gh2].includes(this.game)) {
                this.game = gloomhavenGame;
            }
            if (!this.enabledGames.includes(this.game)) {
                this.enabledGames = enableGame(this.game);
            }
            if ([Game.gh2, Game.fc].includes(this.game) && !this.enabledGames.includes(Game.gh)) {
                this.enabledGames = enableGame(Game.gh);
            }
            // gh2 is played in the gh slot, so it's enabled along with gh
            if (this.enabledGames.includes(Game.gh) && !this.enabledGames.includes(gloomhavenGame)) {
                this.enabledGames = enableGame(gloomhavenGame);
            }
            this.stories = this.storyRepository.getStories();
            if (JSON.stringify(this.campaignData) !== loaded) {
                this.storySyncer.absorbMigrations();
            }
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
            this.enabledGames = getEnabledGames();
            this.$bus.$on('enabled-games-changed', (enabledGames) => this.enabledGames = enabledGames);
            this.$bus.$on('orientation-changed', (isPortrait) => this.isPortrait = isPortrait);
            this.$bus.$on('has-mouse', (hasMouse) => this.hasMouse = hasMouse);
            checkOrientation(this.$bus);
            this.offlineChecker.handle();
            this.webpSupported = isWebpSupported();
            checkHasMouse(this.$bus);
            migrateVersion1Progress();
            this.game = this.storedGame();
            getFont();
            registerServiceWorker();
        }
    }
});

// Vue components
Object.entries(components)
    .forEach(([path, component]) => vueApp.component(path.split('/').pop().split('.')[0], component.default));

// Before Sentry, which wraps the errorHandler set here.
registerGlobals(vueApp);

if (Helpers.inProduction() && import.meta.env.MIX_SENTRY_DSN) {
    Sentry.init({
        app: vueApp,
        dsn: import.meta.env.MIX_SENTRY_DSN,
        logErrors: false
    });
}

bus.errorHandler = error => vueApp.config.errorHandler(error, null, 'event bus');
vueApp.config.globalProperties.$bus = bus;
vueApp.use(router);
vueApp.use(i18n);
window.app = vueApp.mount('#app');
