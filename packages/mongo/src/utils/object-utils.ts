
export function objectIdToDate(objectId) {
    return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
}
export function arrayToObject(arr, key, val){
    key = key || '_id';
    val = val || Object.keys(arr[0]).find(x => x !== '_id');
    return arr.reduce((acc, x) => Object.assign(acc, {[x[key]]: x[val]}), {});
}
