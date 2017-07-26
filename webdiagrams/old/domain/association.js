"use strict";
/**
 * A class that represents object-oriented classes' associations.
 * @param {String} name The association name.
 * @returns {Association} A new association between classes.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.Association = function (name) {
    this.name = name;
    this.participants = [];
}
;
webdiagrams.Association.prototype = {
    constructor: webdiagrams.Association,
    getName: function () {
        return this.name;
    },
    setName: function (name) {
        this.name = name;
    },
    addParticipant: function (participant) {
        this.participants.push(participant);
    },
    removeParticipant: function (participants) {
        this.participants.splice(this.participants.indexOf(participants), 1);
    }
};
