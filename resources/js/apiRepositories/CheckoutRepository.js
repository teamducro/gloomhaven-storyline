import ApiRepository from "./ApiRepository";

export default class CheckoutRepository extends ApiRepository {
    async checkout(storyId, games) {
        let url = 'checkout';
        if (storyId) {
            url += '/' + storyId
        } else {
            this.api.withoutToken()
        }
        const response = await this.api.post(url, {games});

        return response;
    }
}
