import Model from "./Model";

class Patron extends Model {

    constructor(properties) {
        super();

        this.name;
        this.is_gold;

        this.map(properties)
    }

}

export default Patron
