import AchievementRepository from "../repositories/AchievementRepository";
import AchievementGroup from "../models/AchievementGroup";

class AchievementValidator {
    validate() {
        this.checkCityRule()
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

    get achievementRepository() {
        return this._achievementRepository || (this._achievementRepository = new AchievementRepository);
    }
}

export default AchievementValidator;
