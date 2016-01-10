
var Q = require("q");
var deep = require('./deep-promise.js')(Q.Promise);

module.exports = function(value) {
    return deep(value);
};