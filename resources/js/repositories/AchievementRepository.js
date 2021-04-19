import Achievement from "../models/Achievement";
import ScenarioRepository from "./ScenarioRepository";
import AchievementGroup from "../models/AchievementGroup";
import {ScenarioState} from "../models/ScenarioState";
import StorySyncer from "../services/StorySyncer";
import GameData from "../services/GameData";

export default class AchievementRepository {

    fetch(game) {
        return collect((new GameData).achievements(game)).map((achievement) => {
            achievement = new Achievement(achievement);
            return achievement;
        });
    }

    gain(id) {
        let achievement = this.find(id);

        // An achievement can require an other achievement
        if (achievement.requirement) {
            let fulfilledRequirements = app.achievements
                .where('id', achievement.requirement)
                .where('awarded', true);
            if (fulfilledRequirements.count() === 0) {
                return;
            }
        }

        // Lose the current achievement in the group because it is replaced
        if (achievement.group) {
            let group = new AchievementGroup(achievement.group);
            if (group.current) {
                this.find(group.current).lose();
            }
            group.gain(achievement.id);
        }

        // Gain the next achievement from the upgrade list
        if (achievement.upgrades.length && achievement.awarded) {
            let next = this.findMany(achievement.upgrades)
                .first(item => !item.awarded);
            if (next) {
                next.gain();
            }
        }

        achievement.gain();
        this.unlockScenariosByAchievement(achievement);
    }

    // These achievements are unlocked via the user interface and may unlock scenarios.
    unlockScenariosByAchievement(achievement, unlock = true) {
        if (achievement.is_manual) {
            const scenario = this.scenarioRepository.getSideScenarioByManualAchievement(achievement)
            if (unlock && scenario
                && scenario.state !== ScenarioState.incomplete
                && scenario.state !== ScenarioState.complete) {
                this.scenarioRepository.changeState(scenario, ScenarioState.incomplete);
            } else if (!unlock && scenario && scenario.isVisible()) {
                this.scenarioRepository.changeState(scenario, ScenarioState.hidden);
            } else {
                this.storySyncer.store();
            }
        }
    }

    lockScenariosByAchievement(achievement) {
        this.unlockScenariosByAchievement(achievement, false);
    }

    remove(id) {
        let achievement = this.find(id);

        // Gain the last achievement from the group because the current is lost.
        if (achievement.group) {
            let group = new AchievementGroup(achievement.group);
            group.remove(achievement.id);

            if (group.current) {
                this.find(group.current).gain();
            }
        }

        // Remove one achievement from the list
        if (achievement.upgrades.length) {
            let last = this.findMany(achievement.upgrades)
                .last(item => item.awarded) || achievement;
            last.remove();
        }

        achievement.remove();
        this.lockScenariosByAchievement(achievement);
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
        query = query.trim().toLowerCase().replace('-', ' ');
        return this.where((achievement) => {
            return achievement.is_manual
                && !achievement.manual_awarded
                && achievement.name.toLowerCase().replace('-', ' ').startsWith(query);
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

    get storySyncer() {
        return this._storySyncer || (this._storySyncer = new StorySyncer);
    }

}
