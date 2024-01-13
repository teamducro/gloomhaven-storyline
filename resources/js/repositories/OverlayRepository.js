import Overlay from "../models/Overlay";
import GameData from "../services/GameData";
import ScenarioValidator from "../validators/ScenarioValidator";

export default class OverlayRepository {
    fetch(game) {
        return collect(this.gameData.overlays(game)).map((overlay) => {
            return new Overlay(overlay);
        });
    }

    add(id) {
        let overlay = this.find(id);

        if (!overlay) {
            return;
        }

        overlay.present = true;

        // potentially unlock scenarios
        this.scenarioValidator.validate();
    }

    remove(id) {
        let overlay = this.find(id);

        if (!overlay) {
            return;
        }

        overlay.present = false;

        // potentially lock scenarios
        this.scenarioValidator.validate();
    }

    findLinkedFrom(scenario) {
        return this.where(overlay => overlay.linkedFrom.contains(scenario.id));
    }

    find(id) {
        return this.get().firstWhere('id', id);
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
        return app.overlays || collect();
    }
    
    get gameData() {
        return this._gameData || (this._gameData = new GameData());
    }

    get scenarioValidator() {
        return this._scenarioValidator || (this._scenarioValidator = new ScenarioValidator);
    }
}
