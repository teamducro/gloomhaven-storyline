import Model from "./Model";
import moment from "moment";

class Snapshot extends Model {

    constructor(properties) {
        super();

        this.id;
        this.name;
        this.hash;
        this.created_at;

        this.map(properties);
        this.cast();
    }

    cast() {
        this.created_at = moment(this.created_at);
    }

    isCurrent(story) {
        return this.hash === story.hash;
    }

}

export default Snapshot
