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
            this.fixAchievementGroups();
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
        else if (cityRuleGroup.achievements[0] !== 'GCRM') {
            cityRuleGroup._achievements.unshift('GCRM');
            cityRuleGroup.store();
        }
    }

    fixAchievementGroups() {
        let groupCodes = this.achievementRepository.where((achievement) => {
            return achievement.group;
        }).pluck('group').unique();

        groupCodes.each((groupId) => {
            let group = new AchievementGroup(groupId);
            if (group.achievements.length) {
                const lastAchievementId = group.achievements.slice(-1)[0];
                const achievement = this.achievementRepository.find(lastAchievementId);
                if (!achievement.awarded) {
                    this.achievementRepository.gain(lastAchievementId);
                }
            }
        });
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
