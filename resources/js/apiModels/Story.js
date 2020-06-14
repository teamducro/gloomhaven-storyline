import Model from "./Model";
import moment from "moment";

class Story extends Model {

    constructor(properties) {
        super();

        this.id;
        this.name;
        this.data;
        this.hash;
        this.expires_at;
        this.has_expired;
        this.campaignId;

        this.map(properties);
        this.cast();
    }

    cast() {
        this.expires_at = moment(this.expires_at);
        this.campaignId = 'campaign' + this.id;
    }

    postData() {
        return {
            data: JSON.stringify(this.data),
            name: this.name
        }
    }

}

export default Story
