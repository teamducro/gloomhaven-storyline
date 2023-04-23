import Building from "../models/Building";
import {BuildingState} from "../models/BuildingState";
import GameData from "../services/GameData";

export default class BuildingRepository {
    fetch(game) {
        return collect(this.gameData.buildings(game)).map((building) => {
            // Set starting buildings
            if (building.unlocked) {
                building.state = BuildingState.available;
            }
            if (building.built) {
                building.state = BuildingState.built;
                building.level = 1;
            }
            return new Building(building);
        });
    }

    changeState(building, state) {
        if (!isNaN(building)) {
            building = this.find(building);
        }

        if (!building) {
            return;
        }

        building.state = state;
    }

    setLocked(building) {
        this.changeState(building, BuildingState.locked);
    }

    setAvailable(building) {
        this.changeState(building, BuildingState.available);
    }

    setBuilt(building) {
        this.changeState(building, BuildingState.built);
    }

    setDamaged(building) {
        this.changeState(building, BuildingState.damaged);
    }

    setWrecked(building) {
        this.changeState(building, BuildingState.wrecked);
    }

    find(id) {
        return this.get().firstWhere('id', parseInt(id));
    }

    findMany(list) {
        return collect().wrap(list).map((id) => {
            return this.find(id);
        });
    }

    where(filter) {
        return this.get().filter(filter);
    }

    whereKeyValue(key, value) {
        return this.get().where(key, value);
    }

    get() {
        return app.buildings || collect();
    }

    whereState(state) {
        return this.whereKeyValue("state", state);
    }
    
    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }
}
