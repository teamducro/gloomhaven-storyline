import Model from "./Model";

class User extends Model {

    constructor(properties) {
        super();

        this.id;
        this.name;
        this.email;

        this.map(properties)
    }

}

export default User
