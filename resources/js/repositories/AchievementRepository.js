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
            app.achievements
                .where('group', achievement.group)
                .where('awarded', true)
                .each((sameGroupAchievement) => sameGroupAchievement.awarded = false);
        }
        if (achievement.upgrades.length && achievement.awarded) {
            let next = this.findMany(achievement.upgrades)
                .first(item => !item.awarded) || achievement;
            next.awarded = true;
        }
        achievement.count++;
        achievement.awarded = true;
    }

    lose(id) {
        let achievement = this.find(id);
        if (achievement.upgrades.length) {
            let last = this.findMany(achievement.upgrades)
                .last(item => item.awarded) || achievement;
            last.awarded = false;
        }

        achievement.count--;
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
