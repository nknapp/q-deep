var Q = require("q");

function handleArray(arr) {
    return Q.all(arr.map(handleAny));
}

function handleObject(obj) {
    var keys = Object.keys(obj);
    var values = keys.map(function (key) {
        return obj[key];
    });
    return handleArray(values).then(function(valueResults) {
        var result = {};
        for (var i=0; i<keys.length; i++) {
            result[keys[i]] = valueResults[i];
        }
        return result;
    });
}

/**
 * Return a promise for an object, array, or other value, with all internal promises resolved.
 * @param obj
 * @returns {*}
 */
function handleAny(obj) {
    if (Q.isPromise(obj)) {
        return obj.then(handleAny);
    } else if ('[object Object]' === Object.prototype.toString.call(obj)) {
        return handleObject(obj);
    } else if ('[object Array]' === Object.prototype.toString.call(obj)) {
        return handleArray(obj);
    } else {
        return obj;
    }
}

module.exports = function(value) {
    return Q(handleAny(value));
};