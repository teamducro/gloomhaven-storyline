import Storable from './Storable';

class AchievementGroup {

    constructor(id) {
        this.id = id;
        this._achievements = [];

        this.fieldsToStore = {
            "achievements": "_achievements"
        };

        this.read();
    }

    gain(id) {
        if (this.hasGained(id)) {
            return;
        }
        this._achievements.push(id);
        this.store();
    }

    remove(id) {
        if (!this.hasGained(id)) {
            return;
        }
        this._achievements.splice(this._achievements.indexOf(id));
        this.store();
    }

    get current() {
        return this.achievements.slice(-1)[0];
    }

    set achievements(achievements) {
        this._achievements = achievements;
        this.store();
    }

    get achievements() {
        return this._achievements;
    }

    hasGained(id) {
        return this.achievements.indexOf(id) >= 0;
    }

}

Object.assign(AchievementGroup.prototype, Storable);

export default AchievementGroup
