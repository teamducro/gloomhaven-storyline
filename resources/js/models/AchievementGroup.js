import Storable from './Storable';

/**
 * A group of achievements, only one of which can be gained at a time.
 */
class AchievementGroup {

    constructor(id) {
        this.id = id;
        this._achievements = [];

        this.fieldsToStore = {
            "achievements": {"_achievements": this._achievements}
        };

        this.read();
    }

    gain(id) {
        if (this.current === id) {
            return;
        }
        this._achievements.push(id);
        this.store();
    }

    remove(id) {
        if (this.current !== id) {
            return;
        }
        this._achievements.pop();
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

    key() {
        return 'achievementgroup-' + this.id;
    }

}

Object.assign(AchievementGroup.prototype, Storable);

export default AchievementGroup
