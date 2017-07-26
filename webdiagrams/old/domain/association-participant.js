"use strict";
/**
 * A class that represents object-oriented associations' participants.
 * @param {String} name The class name.
 * @param {String} baseClass The base class.
 * @returns {AssociationParticipant} A new class.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.AssociationParticipant = function (multiplicity, role, navigable) {
    this.multiplicity = multiplicity;
    this.role = role;
    this.navigable = navigable || Navigation.NON_SPECIFIED;
}
;
webdiagrams.AssociationParticipant.prototype = {
    constructor: webdiagrams.AssociationParticipant,
    getMultiplicity: function () {
        return this.multiplicity;
    },
    setMultiplicity: function (multiplicity) {
        this.multiplicity = multiplicity;
    },
    getRole: function () {
        return this.role;
    },
    setRole: function (role) {
        this.role = role;
    },
    getNavigable: function () {
        return this.navigable;
    },
    setNavigable: function (navigable) {
        this.navigable = navigable;
    }
};
