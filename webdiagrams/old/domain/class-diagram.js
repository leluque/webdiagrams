"use strict";
/**
 * A class that represents object-oriented class diagrams.
 * @param {String} name The diagram name.
 * @returns {Class} A new class diagram.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.ClassDiagram = function (name) {
    this.setName(name);
};
webdiagrams.ClassDiagram.prototype = new webdiagrams.NodeLinkDiagram();
webdiagrams.ClassDiagram.prototype.constructor = webdiagrams.ClassDiagram;
webdiagrams.ClassDiagram.prototype.addClass = function (_class) {
    this.addNode(_class);
};
webdiagrams.ClassDiagram.prototype.countClasses = function () {
    return this.countNodes();
};
webdiagrams.ClassDiagram.prototype.getClass = function (i) {
    return getNode(i);
};
webdiagrams.ClassDiagram.prototype.removeClass = function (_class) {
    this.removeClass(_class);
};