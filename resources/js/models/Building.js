import {BuildingState} from "./BuildingState";
import Storable from './Storable';
import UsesTranslations from "./UsesTranslations";

class Building {

    constructor(data) {
        this.id = data.id;
        this.number = `#${this.id}`;
        this._name = data.name;
        this.levels = data.levels || [];
        this._level = data.level || 0;
        this._state = data.state || BuildingState.locked;
        this.game = data.game;
        this.translationKey = `buildings.${this.game}-${this.id}`;

        this.fieldsToStore = {
            "state": "_state",
            "level": "_level",
        };

        this.read();
    }

    isLocked() {
        return this.state === BuildingState.locked;
    }

    isUnlocked() {
        return this.state !== BuildingState.locked;
    }
    
    isAvailable() {
        return this.state === BuildingState.available;
    }

    isBuilt() {
        return this.state === BuildingState.built;
    }

    isDamaged() {
        return this.state === BuildingState.damaged;
    }

    isWrecked() {
        return this.state === BuildingState.wrecked;
    }
    
    set state(state) {
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.store();
    }

    get state() {
        return this._state;
    }

    set level(level) {
        if (this._level === level) {
            return;
        }
        this._level = level;
        this.store();
    }

    get level() {
        return this._level || 0;
    }

    get completed() {
        return this.level >= this.levels.length - 1;
    }

    get upgraded() {
        // The level 1 buildings without sticker coordinates have not been upgraded
        return this.level > 0 && !(this.coordinates.x === 0 && this.coordinates.y === 0);
    }

    get name() {
        return this.$tPrefix('name');
    }

    get coordinates() {
        return this.levels[this.level].coordinates;
    }

    get operations() {
        if (this.level === 0) {
            return "";
        }
        return this.$tPrefix(`levels.${this.level}.operations`);
    }

    get downtime() {
        if (this.level === 0) {
            return "";
        }
        return this.$tPrefix(`levels.${this.level}.downtime`);
    }

    get wrecked() {
        if (this.level === 0) {
            return "";
        }
        return this.$tPrefix(`levels.${this.level}.wrecked`);
    }

    get passive() {
        if (this.level === 0) {
            return "";
        }
        return this.$tPrefix(`levels.${this.level}.passive`);
    }

    get rewards() {
        if (this.level === 0) {
            return "";
        }
        return this.$tPrefix(`levels.${this.level}.rewards`);
    }

    get upgradeCost() {
        return this.levels[this.level].upgrade_cost;
    }

    get nextUpgradeCost() {
        if (!this.completed) {
            return this.levels[this.level + 1].upgrade_cost;
        }
        return null;
    }

    // The building is upgraded some other way besides resources
    get lockedUpgrade() {
        return (this.nextUpgradeCost
            && this.nextUpgradeCost[0] === 1
            && this.nextUpgradeCost[1] === 0
            && this.nextUpgradeCost[2] === 0
            && this.nextUpgradeCost[3] === 0
            && this.nextUpgradeCost[4] === 0
            && this.nextUpgradeCost[5] === 0
        );
    }

    get damageCost() {
        return this.levels[this.level].damage_cost;
    }

    get wreckedCost() {
        return this.levels[this.level].wrecked_cost;
    }

    image() {
        // Some buildings have no image because they are already present
        if (this.coordinates.x === 0 && this.coordinates.y === 0) {
            return '';
        }
        return '/img/buildings/' + this.game + '/' + this.id + '_L' + this.level + '.png';
    }

    key() {
        return 'building-' + this.game + '-' + this.id;
    }
}

Object.assign(Building.prototype, Storable);
Object.assign(Building.prototype, UsesTranslations);

export default Building;
