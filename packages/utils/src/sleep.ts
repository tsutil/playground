export function milliseconds(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(true);
        }, ms);
    });
}
export function seconds(s) {
    return milliseconds(s * 1000);
}
