import achievements from '../achievements.json';
import Achievement from "../models/Achievement";
import ScenarioRepository from "./ScenarioRepository";
import AchievementGroup from "../models/AchievementGroup";
import {ScenarioState} from "../models/ScenarioState";
import scenarios from "../scenarios.json";

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

        if (achievement.is_manual) {
            const scenarioToUnlock = this.scenarioRepository.getSideScenarioByManualAchievement(achievement)
            if (scenarioToUnlock
                && scenarioToUnlock.state !== ScenarioState.incomplete
                && scenarioToUnlock.state !== ScenarioState.complete) {
                this.scenarioRepository.changeState(scenarioToUnlock, ScenarioState.incomplete);
                console.log(scenarioToUnlock.state);
            }
        }
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

        if (achievement.is_manual) {
            const scenarioToHide = this.scenarioRepository.getSideScenarioByManualAchievement(achievement);
            if (scenarioToHide && scenarioToHide.isVisible()) {
                this.scenarioRepository.changeState(scenarioToHide, ScenarioState.hidden);
            }
        }
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

    searchManual(query) {
        query = query.trim().toLowerCase();
        return this.where((achievement) => {
            return achievement.is_manual
                && !achievement.manual_awarded
                && achievement.name.toLowerCase().startsWith(query);
        });
    }

    getSideScenariosWithManualAchievements() {
        let achievements = collect();

        this.scenarioRepository.where(scenario => {
            return scenario.is_side
                && scenario.isVisible()
                && !scenario.required_by.isEmpty();
        }).each(scenario => {
            this.getManualAchievementsByRequiredScenario(scenario, false)
                .each(achievement => achievements.push(achievement));
        });

        return achievements;
    }

    getManualAchievementsByRequiredScenario(scenario, isAwarded = true) {
        let achievements = collect();

        scenario.required_by.each((condition) => {
            let complete = condition.complete || [];
            this.findMany(complete)
                .filter(achievement => achievement.is_manual && achievement.manual_awarded === isAwarded)
                .each(achievement => achievements.push(achievement));
        });

        return achievements;
    }

    groups() {
        return app.achievements.filter((a) => a.group).pluck('group').unique()
            .map((group) => new AchievementGroup(group));
    }

    get scenarioRepository() {
        return this._scenarioRepository || (this._scenarioRepository = new ScenarioRepository());
    }

}
