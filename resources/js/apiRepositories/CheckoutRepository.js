import ApiRepository from "./ApiRepository";

export default class CheckoutRepository extends ApiRepository {
    async checkout(storyId) {
        let url = 'checkout';
        if (storyId) {
            url += '/' + storyId
        } else {
            this.api.withoutToken()
        }
        const response = await this.api.post(url);

        return response;
    }
}
