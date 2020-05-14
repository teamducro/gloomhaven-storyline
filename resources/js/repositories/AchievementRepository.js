import achievements from '../achievements.json';
import Achievement from "../models/Achievement";
import ScenarioRepository from "./ScenarioRepository";
import AchievementGroup from "../models/AchievementGroup";

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
            let group = new AchievementGroup(achievement.group);
            if (group.current) {
                this.find(group.current).lose();
            }
            group.gain(achievement.id);
        }
        if (achievement.upgrades.length && achievement.awarded) {
            let next = this.findMany(achievement.upgrades)
                .first(item => !item.awarded);
            if (next) {
                next.gain();
            }
        }

        achievement.gain();
    }

    remove(id) {
        let achievement = this.find(id);
        if (achievement.group) {
            let group = new AchievementGroup(achievement.group);
            group.remove(achievement.id);

            if (group.current) {
                this.find(group.current).gain();
            }
        }
        if (achievement.upgrades.length) {
            let last = this.findMany(achievement.upgrades)
                .last(item => item.awarded) || achievement;
            last.remove();
        }

        achievement.remove();
    }

    lose(id) {
        let achievement = this.find(id);
        achievement.lose();
    }

    find(id) {
        return app.achievements.firstWhere('id', id);
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        });
    }

    where(filter) {
        return app.achievements.filter(filter);
    }

    groups() {
        return app.achievements.filter((a) => a.group).pluck('group').unique()
            .map((group) => new AchievementGroup(group));
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository());
    }

}
