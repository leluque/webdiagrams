"use strict";
/**
 * A class that represents object-oriented classes' operations.
 * @param {String} name The operation name.
 * @returns {Operation} A new operation.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.Operation = function (name) {
    this.visibility = Visibility.PUBLIC;
    this.name = name;
    this.parameters = [];
    this.returnType = "void";
    this._isAbstract = false;
    this._isStatic = false;
}
;
webdiagrams.Operation.prototype.constructor = webdiagrams.Operation;
webdiagrams.Operation.prototype.getVisibility = function () {
    return this.visibility;
};
webdiagrams.Operation.prototype.setVisibility = function (visibility) {
    this.visibility = visibility;
};
webdiagrams.Operation.prototype.getName = function () {
    return this.name;
};
webdiagrams.Operation.prototype.setName = function (name) {
    this.name = name;
};
webdiagrams.Operation.prototype.addParameter = function (parameter) {
    this.parameters.push(parameter);
};
webdiagrams.Operation.prototype.countParameters = function () {
    return this.parameters.length;
};
webdiagrams.Operation.prototype.getParameter = function (i) {
    return this.parameters[i];
};
webdiagrams.Operation.prototype.removeParameter = function (parameter) {
    this.parameters.splice(this.fields.indexOf(parameter), 1);
};
webdiagrams.Operation.prototype.getReturnType = function () {
    return this.returnType;
};
webdiagrams.Operation.prototype.setReturnType = function (returnType) {
    this.returnType = returnType;
};
webdiagrams.Operation.prototype.isAbstract = function () {
    return this._isAbstract;
};
webdiagrams.Operation.prototype.setAbstract = function (_isAbstract) {
    this._isAbstract = _isAbstract;
};
webdiagrams.Operation.prototype.isStatic = function () {
    return this._isStatic;
};
webdiagrams.Operation.prototype.setStatic = function (_isStatic) {
    this._isStatic = _isStatic;
};
webdiagrams.Operation.prototype.toString = function () {
    var operationAsText = Visibility.properties[this.visibility].text + " " + this.getName() + "(";
    // Write the parameters.
    for (var i = 0; i < this.countParameters() - 1; i++) {
        operationAsText += this.getParameter(i).toString() + ", ";
    }
    operationAsText += this.getParameter(this.countParameters() - 1).toString() + ")";
    // Write the return type.
    if (this.getReturnType() !== null) {
        operationAsText += ": " + this.getReturnType();
    }
    return operationAsText;
};