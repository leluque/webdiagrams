"use strict";
/**
 * A class that represents drawed nodes.
 * @param {Integer} x The x position.
 * @param {Integer} y The y position.
 * @returns {DrawedNode} A new drawed node.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.DrawedNode = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.boundaries = null;
};
webdiagrams.DrawedNode.prototype.constructor = webdiagrams.DrawedNode;
webdiagrams.DrawedNode.prototype.getX = function () {
    return this.x;
};
webdiagrams.DrawedNode.prototype.setX = function (x) {
    this.x = x;
};
webdiagrams.DrawedNode.prototype.getY = function () {
    return this.y;
};
webdiagrams.DrawedNode.prototype.setY = function (y) {
    this.y = y;
};
webdiagrams.DrawedNode.prototype.getBoundaries = function () {
    return this.boundaries;
};
webdiagrams.DrawedNode.prototype.setBoundaries = function (boundaries) {
    this.boundaries = boundaries;
};