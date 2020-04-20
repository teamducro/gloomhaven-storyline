import achievements from '../achievements.json';
import Achievement from "../models/Achievement";
import ScenarioRepository from "./ScenarioRepository";

export default class AchievementRepository {

    fetch() {
        return collect(achievements.achievements).map((achievement) => {
            achievement = new Achievement(achievement);
            return achievement;
        });
    }

    gain(id) {
        let achievement = this.find(id);
        if (achievement.requirement) {
            let fulfilledRequirements = app.achievements
                .where('id', achievement.requirement)
                .where('awarded', true);
            if (fulfilledRequirements.count() === 0) {
                return;
            }
        }
        if (achievement.group) {
            let sameGroupAchievements = app.achievements
                .where('group', achievement.group)
                .where('awarded', true)
                .each((sameGroupAchievement) => sameGroupAchievement.awarded = false)
        }
        achievement.awarded = true;
    }
    lose(id) {
        let achievement = this.find(id);
        achievement.awarded = false;
    }

    find(id) {
        return app.achievements.firstWhere('id', id);
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        });
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository());
    }

}
