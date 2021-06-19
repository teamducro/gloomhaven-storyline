import ApiRepository from "./ApiRepository";
import Patron from "../apiModels/Patron";

export default class PatronRepository extends ApiRepository {
    async list() {
        const response = await this.api.get('patrons');
        const patrons = response.data.data;

        return patrons.map((p) => {
            return new Patron(p);
        });
    }
}
