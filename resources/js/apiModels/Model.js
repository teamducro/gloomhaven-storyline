class Model {

    constructor() {

    }

    map(properties) {
        if (typeof properties === 'object') {
            for (let [property, value] of Object.entries(properties)) {
                this[property] = value;
            }
        }
    }
}

export default Model
