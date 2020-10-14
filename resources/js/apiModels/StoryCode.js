import Model from "./Model";
import moment from "moment";

class StoryCode extends Model {

    constructor(properties) {
        super();

        this.code;
        this.created_at;
        this.expires_at;

        this.map(properties);
        this.cast();
    }

    cast() {
        this.created_at = moment(this.created_at);
        this.expires_at = moment(this.expires_at);
    }

    expirationProgress() {
        const totalSeconds = Math.floor(this.expires_at.diff(this.created_at) / 1000);
        const seconds = Math.floor(this.expires_at.diff() / 1000);
        const percentage = Math.ceil(Math.max(0, seconds / totalSeconds * 100));
        const time = moment().seconds(seconds).format('MMM DD YYYY hh:mm');

        return {percentage, time};
    }

}

export default StoryCode
