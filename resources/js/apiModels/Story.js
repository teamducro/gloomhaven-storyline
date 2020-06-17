import Model from "./Model";
import moment from "moment";

const md5 = require('js-md5');

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

    hasChanged() {
        return this.hash !== this.makeHash();
    }

    makeHash() {
        return md5(JSON.stringify(this.data));
    }

    postData() {
        return {
            data: JSON.stringify(this.data),
            name: this.name
        }
    }

}

export default Story
