import ApiService from "../services/ApiService";

export default class ApiRepository {

    constructor() {
        this.api = new ApiService();
    }

}
