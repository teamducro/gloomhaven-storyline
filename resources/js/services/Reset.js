import store from "store/dist/store.modern";

export default class Reset {
    reset() {
        store.remove('local')
    }
}
