import Model from "./Model";
import moment from "moment";
import Snapshot from "./Snapshot";
import LZString from "lz-string";

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
        this.is_shared;
        this.is_new;
        this.updated_at;
        this.token;
        this.campaignId;
        this.snapshots;

        this.map(properties);
        this.cast();
    }

    cast() {
        if (typeof this.data === 'string') {
            this.data = JSON.parse(LZString.decompressFromEncodedURIComponent(this.data));
        }
        this.expires_at = moment(this.expires_at);
        this.updated_at = this.updated_at
            ? moment(this.updated_at)
            : moment().subtract(10, 'years');
        this.campaignId = '_' + this.id;
        this.snapshots = collect(this.snapshots).map((snapshot) => {
            return new Snapshot(snapshot);
        })
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
