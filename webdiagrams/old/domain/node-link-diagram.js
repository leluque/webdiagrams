"use strict";
/**
 * A class that represents node-and-link diagrams.
 * @param {String} name The diagram name.
 * @returns {NodeLinkDiagram} A new node-and-link diagram.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.NodeLinkDiagram = function (name) {
    this.name = name || "unnamed";
    this.nodes = [];
};
webdiagrams.NodeLinkDiagram.prototype.constructor = webdiagrams.NodeLinkDiagram;
webdiagrams.NodeLinkDiagram.prototype.getName = function () {
    return this.name;
};
webdiagrams.NodeLinkDiagram.prototype.setName = function (name) {
    this.name = name;
};
webdiagrams.NodeLinkDiagram.prototype.addNode = function (_node) {
    this.nodes.push(_node);
};
webdiagrams.NodeLinkDiagram.prototype.countNodes = function () {
    return this.nodes.length;
};
webdiagrams.NodeLinkDiagram.prototype.getNode = function (i) {
    return this.nodes[i];
};
webdiagrams.NodeLinkDiagram.prototype.removeNode = function (_node) {
    this.nodes.splice(this.nodes.indexOf(_node), 1);
};
webdiagrams.NodeLinkDiagram.prototype.whichElementIsAt = function (x, y) {
    for (var i = 0; i < this.countNodes(); i++) {
        if (this.getNode(i).getBoundaries().contains(x, y)) {
            return {
                type: "NODE",
                element: this.getNode(i)
            };
        }
    }
    return null;
};