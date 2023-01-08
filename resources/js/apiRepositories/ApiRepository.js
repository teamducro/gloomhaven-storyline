import ApiClient from "../services/ApiClient";

export default class ApiRepository {

    constructor() {
        this.api = new ApiClient();
    }

}
