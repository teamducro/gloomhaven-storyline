import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";
import ScenarioRepository from "../repositories/ScenarioRepository";

class AchievementValidator {

    constructor() {
        this.validateOneTime = true;
    }

    validate() {
        if (this.validateOneTime) {
            this.checkCityRule();
            this.checkMissingManualAchievements();
        }

        this.validateOneTime = false;
    }

    checkCityRule() {
        let cityRuleGroup = new AchievementGroup('CR');
        if (!cityRuleGroup.achievements.length) {
            this.achievementRepository.gain('GCRM');
        }
        // Fix missing starting City Rule: Militaristic
        else if (cityRuleGroup.achievements[0] != 'GCRM') {
            cityRuleGroup._achievements.unshift('GCRM');
            cityRuleGroup.store();
        }
    }

    checkMissingManualAchievements() {
        this.achievementRepository.getSideScenariosWithManualAchievements()
            .each(achievement => {
                this.achievementRepository.gain(achievement.id);
            })
    }

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository);
    }
}

export default AchievementValidator;
