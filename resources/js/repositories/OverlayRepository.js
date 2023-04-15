import Overlay from "../models/Overlay";
import GameData from "../services/GameData";

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

        this.unlockScenariosByOverlay(overlay);
    }

    remove(id) {
        let overlay = this.find(id);

        if (!overlay) {
            return;
        }

        overlay.present = false;

        this.lockScenariosByOverlay(overlay);
    }

    unlockScenariosByOverlay(overlay, unlock = true) {
        // TODO
    }

    lockScenariosByOverlay(overlay) {
        this.unlockScenariosByOverlay(overlay, false);
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
}
