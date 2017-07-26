"use strict";
/**
 * A class that represents drawed class preferences.
 * @param {String} backgroundColor The background color.
 * @param {String} borderColor The border color.
 * @returns {ClassPreferences} A new class preference.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.ClassPreferences = function (backgroundColor, borderColor) {
    this.backgroundColor = backgroundColor || "#FFFFCC";
    this.borderColor = borderColor || "#000";
}
;
webdiagrams.ClassPreferences.prototype = {
    constructor: webdiagrams.ClassPreferences,
    getBackgroundColor: function () {
        return this.backgroundColor;
    },
    setBackgroundColor: function (backgroundColor) {
        this.backgroundColor = backgroundColor;
    },
    getBorderColor: function () {
        return this.borderColor;
    },
    setBorderColor: function (borderColor) {
        this.borderColor = borderColor;
    }
};