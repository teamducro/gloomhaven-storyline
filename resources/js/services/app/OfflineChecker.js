import moment from "moment";
import ApiService from "../ApiService";

export default class OfflineChecker {
    constructor($bus) {
        this.$bus = $bus;
        this.isOffline = false;
        this.checkEverySeconds = 60;
        this.apiService = new ApiService;
    }

    handle() {
        setInterval(() => {
            this.check();
        }, this.checkEverySeconds * 1000);
    }

    check() {
        this.apiService.head('/ping?t=' + moment().format('x'))
            .then(() => {
                if (this.isOffline) {
                    this.$bus.$emit('toast', 'Back online!');
                }
                this.isOffline = false;
            })
            .catch(e => {
                this.isOffline = true;
                this.$bus.$emit('toast', 'Offline, changes are only stored locally.', false);
            });
    }
}
