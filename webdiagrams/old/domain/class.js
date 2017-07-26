"use strict";
/**
 * A class that represents object-oriented classes (class-based object-orientation).
 * @param {String} name The class name.
 * @param {String} baseClass The base class.
 * @returns {Class} A new class.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.Class = function (name, baseClass) {
    this.name = name;
    this.stereotypes = [];
    this.fields = [];
    this.operations = [];
    // Relationships.
    this.baseClass = baseClass || null;
    this.associations = [];
}
;
webdiagrams.Class.prototype = {
    constructor: webdiagrams.Class,
    addStereotype: function (stereotype) {
        this.stereotypes.push(stereotype);
    },
    countStereotypes: function() {
        return this.stereotypes.length;  
    },
    getStereotype: function(i) {
        return this.stereotypes[i];
    },
    removeStereotype: function (stereotype) {
        this.stereotypes.splice(this.stereotypes.indexOf(stereotype), 1);
    },
    addField: function (field) {
        this.fields.push(field);
    },
    countFields: function() {
        return this.fields.length;  
    },
    getField: function(i) {
        return this.fields[i];
    },
    removeField: function (field) {
        this.fields.splice(this.fields.indexOf(field), 1);
    },
    addOperation: function (operation) {
        this.operations.push(operation);
    },
    countOperations: function() {
        return this.operations.length;  
    },
    getOperation: function(i) {
        return this.operations[i];
    },
    removeOperation: function (operation) {
        this.operations.splice(this.operations.indexOf(operation), 1);
    },
    getName: function () {
        return this.name;
    },
    setName: function (name) {
        this.name = name;
    },
    getBaseClass: function () {
        return this.baseClass;
    },
    setBaseClass: function (baseClass) {
        this.baseClass = baseClass;
    },
    addAssociation: function (association) {
        this.associations.push(association);
    },
    removeAssociation: function (association) {
        this.associations.splice(this.associations.indexOf(association), 1);
    }
};
