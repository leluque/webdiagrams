"use strict";
/**
 * A class that represents drawed classes.
 * @param {ClassPreferences} preferences The drawed class preferences.
 * @returns {DrawedClass} A new drawed class.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.DrawedClass = function (_class, preferences) {
    this._class = _class;
    this.preferences = preferences || new webdiagrams.ClassPreferences();
};
webdiagrams.DrawedClass.prototype = new webdiagrams.DrawedNode();
webdiagrams.DrawedClass.prototype.constructor = webdiagrams.DrawedNode;
webdiagrams.DrawedClass.prototype.getClass = function () {
    return this._class;
};
webdiagrams.DrawedClass.prototype.setClass = function (_class) {
    this._class = _class;
};
webdiagrams.DrawedClass.prototype.getPreferences = function () {
    return this.preferences;
};
webdiagrams.DrawedClass.prototype.setPreferences = function (preferences) {
    this.preferences = preferences || new ClassPreferences();
};
