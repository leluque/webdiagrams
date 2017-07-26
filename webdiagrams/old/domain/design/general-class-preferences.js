"use strict";
/**
 * A class that represents general drawed class preferences.
 * @param {Integer} horPad The horizontal class padding.
 * @param {Integer} verPad The vertical class padding.
 * @param {Integer} horTextMarg The horizontal text margin.
 * @param {Integer} verTextMarg The vertical text margin.
 * @returns {ClassPreferences} New font preferences.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.GeneralClassPreferences = function (horPad, verPad, horTextMarg, verTextMarg, borderSize) {
    this.horPad = horPad || 5;
    this.verPad = verPad || 5;
    this.horTextMarg = horTextMarg || 5;
    this.verTextMarg = verTextMarg || 5;
    this.borderSize = borderSize || 2;
}
;
webdiagrams.GeneralClassPreferences.prototype = {
    constructor: webdiagrams.GeneralClassPreferences,
    getHorPad: function () {
        return this.horPad;
    },
    setHorPad: function (horPad) {
        this.horPad = horPad;
    },
    getVerPad: function () {
        return this.verPad;
    },
    setVerPad: function (verPad) {
        this.verPad = verPad;
    },
    getHorTextMarg: function () {
        return this.horTextMarg;
    },
    setHorTextMarg: function (horTextMarg) {
        this.horTextMarg = horTextMarg;
    },
    getVerTextMarg: function () {
        return this.verTextMarg;
    },
    setVerTextMarg: function (verTextMarg) {
        this.verTextMarg = verTextMarg;
    },
    getBorderSize: function () {
        return this.borderSize;
    },
    setBorderSize: function (borderSize) {
        this.borderSize = borderSize;
    }
};