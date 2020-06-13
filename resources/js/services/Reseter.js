import store from "store/dist/store.modern";

export default class Reseter {
    reset() {
        store.remove('local')
    }
}
