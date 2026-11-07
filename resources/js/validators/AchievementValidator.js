import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";
import GameData from "../services/GameData";
import ScenarioRepository from "../repositories/ScenarioRepository";

class AchievementValidator {

    constructor() {
        this.validateOneTime = true;
    }

    validate() {
        if (this.validateOneTime) {
            const rule = new GameData().campaignRule(app.game, 'defaultCityRule');
            if (rule?.replaceable) {
                this.checkStartingRule(rule);
            } else if (rule) {
                this.checkCityRule(rule);
            }
            this.fixAchievementGroups();
            this.checkMissingManualAchievements();
        }

        this.validateOneTime = false;
    }

    checkCityRule(rule) {
        let cityRuleGroup = new AchievementGroup(rule.group);
        if (!cityRuleGroup.achievements.length) {
            this.achievementRepository.gain(rule.achievement);
        }
        // Fix missing starting City Rule: Militaristic
        else if (cityRuleGroup.achievements[0] !== rule.achievement) {
            cityRuleGroup._achievements.unshift(rule.achievement);
            cityRuleGroup.store();
        }
    }

    // GH2: the board starts with "An Uneasy Peace" until another city rule replaces it.
    checkStartingRule(rule) {
        if (!new AchievementGroup(rule.group).achievements.length) {
            this.achievementRepository.gain(rule.achievement);
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
