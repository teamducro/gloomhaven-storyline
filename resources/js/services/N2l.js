/**
 * Number to Letter
 * 0 => a
 */
export default class N2l {
    convert(number) {
        return String.fromCharCode(97 + number)
    }
}
