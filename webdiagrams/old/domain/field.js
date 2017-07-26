"use strict";
/**
 * A class that represents object-oriented class' fields.
 * @param {String} name The field name.
 * @param {String} type The field type.
 * @returns {Field} A new field.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.Field = function (name, type) {
    this.visibility = Visibility.PRIVATE;
    this.name = name;
    this.type = type || null;
    this.initialValue = null;
    this._isAbstract = false;
    this._isStatic = false;
}
;
webdiagrams.Field.prototype.constructor = webdiagrams.Field;
webdiagrams.Field.prototype.getVisibility = function () {
    return this.visibility;
};
webdiagrams.Field.prototype.setVisibility = function (visibility) {
    this.visibility = visibility || Visibility.PRIVATE;
};
webdiagrams.Field.prototype.getName = function () {
    return this.name;
};
webdiagrams.Field.prototype.setName = function (name) {
    this.name = name;
};
webdiagrams.Field.prototype.getType = function () {
    return this.type;
};
webdiagrams.Field.prototype.setType = function (type) {
    this.type = type;
};
webdiagrams.Field.prototype.getInitialValue = function () {
    return this.initialvalue;
};
webdiagrams.Field.prototype.setInitialValue = function (initialValue) {
    this.initialValue = initialValue;
};
webdiagrams.Field.prototype.isAbstract = function () {
    return this._isAbstract;
};
webdiagrams.Field.prototype.setAbstract = function (_isAbstract) {
    this._isAbstract = _isAbstract;
};
webdiagrams.Field.prototype.isStatic = function () {
    return this._isStatic;
};
webdiagrams.Field.prototype.setStatic = function (_isStatic) {
    this._isStatic = _isStatic;
};
webdiagrams.Field.prototype.toString = function () {
    var fieldAsText = Visibility.properties[this.visibility].text + " " + this.name;
    if (this.type !== null) {
        fieldAsText += ": " + this.type;
    }
    if (this.initialValue !== null) {
        fieldAsText += "= " + this.initialValue;
    }
    return fieldAsText;
};
