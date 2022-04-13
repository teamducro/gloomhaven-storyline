import Model from "./Model";

class User extends Model {

    constructor(properties) {
        super();

        this.id;
        this.name;
        this.lang;
        this.email;
        this.is_patron;

        this.map(properties)
    }

    postData() {
        return {
            lang: this.lang
        }
    }

}

export default User
