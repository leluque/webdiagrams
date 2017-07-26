"use strict";
/**
 * A class that represents font preferences.
 * @param {Integer} font The base-font that will be used by the library.
 * @returns {FontPreferences} New font preferences.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.FontPreferences = function (family, size, bold, italic, underline, color) {
    this.family = family || "Arial";
    this.size = size || "16px";
    this.bold = bold || false;
    this.italic = italic || false;
    this.underline = underline || false;
    this.color = color || "#000";
}
;
webdiagrams.FontPreferences.prototype = {
    constructor: webdiagrams.FontPreferences,
    getFamily: function () {
        return this.family;
    },
    setFamily: function (family) {
        this.family = family;
    },
    getSize: function () {
        return this.size;
    },
    setSize: function (size) {
        this.size = size;
    },
    getColor: function() {
        return this.color;
    },
    setColor: function(color) {
        this.color = color;
    },
    toString: function (bold, italic) {
        var fontAsText = this.size + " " + this.family;
        if (this.bold || bold) {
            fontAsText = "bold " + fontAsText;
        }
        if (this.italic || italic) {
            fontAsText = "italic " + fontAsText;
        }
        return fontAsText;
    }
};