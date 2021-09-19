/**
 * Usage:
 *
 * let result = (new When).filter([
 *     1,
 *     new When(true, 2),
 *     new When(false, () => { return 3 })
 * ]);
 *
 * result = [1, 2]
 */
export default class When {
    constructor(condition = undefined, value = undefined) {
        this.condition = condition;
        this.value = value;
    }

    filter(array) {
        return array.filter((x) => {
            return x instanceof When ? x.condition : true;
        }).map((x) => {
            return x instanceof When ? x.evaluate() : x;
        });
    }

    evaluate() {
        if (this.value instanceof Function) {
            return this.value();
        }

        return this.value;
    }
}
