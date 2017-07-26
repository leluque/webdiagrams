"use strict";
/**
 * A class that represents object-oriented operations' parameters.
 * @param {String} name The parameter name.
 * @param {String} type The parameter type.
 * @returns {Parameter} A new parameter.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.Parameter = function (name, type) {
    this.name = name;
    this.type = type || "";
}
;
webdiagrams.Parameter.prototype = {
    constructor: webdiagrams.Parameter,
    getName: function () {
        return this.name;
    },
    setName: function (name) {
        this.name = name;
    },
    getType: function () {
        return this.type;
    },
    setType: function (type) {
        this.type = type;
    }
};
webdiagrams.Parameter.prototype.toString = function () {
    return this.getName() + ": " + this.getType();
};
