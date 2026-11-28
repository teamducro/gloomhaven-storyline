import {ScenarioState} from "../models/ScenarioState";
import ScenarioRepository from "../repositories/ScenarioRepository";
import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";
import Helpers from "./Helpers";
import Reseter from "./Reseter";
import ChoiceService from "./ChoiceService";
import LZString from "lz-string";
import store from "store/dist/store.modern";


export default class ShareState {
    constructor() {
        this.version = 1;
        this.compatibleIds = [
            'local'
        ];
    }

    // The campaign of a shared link, or false when the link is incompatible
    decodeLink(version, id, compressed) {
        if (this.version < version || this.compatibleIds.includes(id) === false) {
            return false;
        }

        return this.decodeNewLink(compressed);
    }

    importLink(id, decoded) {
        app.switchLocal(id);
        store.set(id, decoded);
    }

    // A fresh boot stores default scenarios and achievements, those aren't progress worth asking about
    hasProgress(id) {
        return Object.entries(store.get(id) || {}).some(([key, value]) => value !== null
            && (/^(sheet|campaign-|character-|building-)/.test(key) || value.state === 'complete'));
    }

    loadOldLink() {
        let result = this.decodeOldLink();

        if (result.hasOwnProperty('states')) {
            this.reseter.reset();
            app.switchLocal();

            if (result.hasOwnProperty('groups')) {
                result.groups.each((achievements, id) => {
                    (new AchievementGroup(id)).achievements = achievements;
                });
            }

            result.states.each((state, id) => {
                this.scenarioRepository.changeState(id, ScenarioState.make(state), false);
            });

            if (result.hasOwnProperty('choices')) {
                result.choices.each((choice, id) => {
                    this.scenarioRepository.find(id).choice = choice;
                });
            }

            if (result.hasOwnProperty('promptChoices')) {
                result.promptChoices.each((choice, id) => {
                    let scenario = this.scenarioRepository.find(id);
                    let promptConfig = this.choiceService.getPromptConfig(scenario);
                    if (typeof promptConfig.callback === 'function') {
                        promptConfig.callback(choice);
                    }
                    scenario.promptChoice = choice;
                });
            }

            if (result.hasOwnProperty('treasures')) {
                result.treasures.each((treasures, id) => {
                    treasures.forEach((treasure) => {
                        const scenario = this.scenarioRepository.find(id);
                        this.scenarioRepository.unlockTreasure(scenario, treasure);
                    });
                });
            }

            alert('This shared link is in the old format, these are deprecated and may be removed in the future. Please share your campaign again to get the new link.');

            location.href = this.url() + '#/story';
        }
    }

    link(id = 'local', path = 'story', game = 'gh') {
        return `${this.url()}#/shared/${this.version}/${id}/${this.encode()}/${path}/${game}`;
    }

    // Route of a pasted share link, e.g. '/shared/1/local/<data>/story/gh'
    sharedPath(link) {
        return link?.trim().match(/#(\/shared\/\d+\/[^/]+\/[^/]+.*)$/)?.[1] || null;
    }

    encodeMap() {
        return {
            '"state":': '±st',
            '"sheet":': '±sh',
            '"achievements":': '±as',
            '"achievementgroup-': '±ag',
            '"awarded":': '±aw',
            '"characters":': '±cha',
            '"choice":': '±ch',
            '"count":': '±co',
            '"itemDesigns":': '±id',
            '"promptChoice":': '±pc',
            '"prosperityIndex":': '±pi',
            'false': '±0',
            'true': '±1',
            '"scenario-': '±s',
            '"achievement-': '±a',
            '"complete"': '±c',
            '"incomplete"': '±i',
            '"blocked"': '±b',
            '"hidden"': '±h',
            '"donations":': '±d',
            '"reputation":': '±r',
            '"notes":': '±n',
            '"unlocks":': '±u',
            '"treasures":': '±t',
            '"lost":': '±l',
            '"manual_awarded":': '±ma'
        }
    }

    encode() {
        let input = JSON.stringify(app.campaignData);

        collect(this.encodeMap()).each((replace, search) => {
            const regEx = new RegExp(search, 'g');
            input = input.replace(regEx, replace);
        });
        const compressed = LZString.compressToEncodedURIComponent(input);

        return compressed;
    }

    // False for a truncated or corrupt link.
    decodeNewLink(compressed) {
        try {
            let decompressed = LZString.decompressFromEncodedURIComponent(compressed);
            if (!decompressed) {
                return false;
            }

            collect(this.encodeMap()).each((search, replace) => {
                const regEx = new RegExp(search, 'g');
                decompressed = decompressed.replace(regEx, replace);
            });

            const decoded = JSON.parse(decompressed);
            return decoded && typeof decoded === 'object' && !Array.isArray(decoded) ? decoded : false;
        } catch {
            return false;
        }
    }

    decodeOldLink() {
        let parsed = Object.fromEntries(new URLSearchParams(location.search));
        let result = {};

        if (typeof parsed.groups !== 'undefined') {
            result.groups = collect(parsed.groups.split('-')).mapWithKeys((group) => {
                let parts = group.split('_');
                let id = parts.shift();
                return [id, parts];
            });
        }

        if (typeof parsed.states !== 'undefined') {
            result.states = collect(parsed.states.split('-')).mapWithKeys((state) => {
                let parts = state.split('_');
                return [parts[0], parts[1].substr(0, 1)];
            });
        }

        if (typeof parsed.choices !== 'undefined') {
            result.choices = collect(parsed.choices.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                return [parts[0], parseInt(parts[1])];
            });
        }

        if (typeof parsed.promptChoices !== 'undefined') {
            result.promptChoices = collect(parsed.promptChoices.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                return [parts[0], parts[1]];
            });
        }

        if (typeof parsed.treasures !== 'undefined') {
            result.treasures = collect(parsed.treasures.split('-')).mapWithKeys((choice) => {
                let parts = choice.split('_');
                let id = parts.shift();
                return [id, parts];
            });
        }

        return result;
    }

    url() {
        return Helpers.inProduction()
            ? import.meta.env.MIX_APP_URL
            : location.protocol + '//' + location.host;
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }

    get choiceService() {
        return this._choiceService || (this._choiceService = new ChoiceService);
    }

    get reseter() {
        return this._reseter || (this._reseter = new Reseter);
    }
}
