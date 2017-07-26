"use strict";
/**
 * A class that represents bounding boxes.
 * @param {Integer} x1 The x1 position.
 * @param {Integer} y1 The y1 position.
 * @param {Integer} x2 The x2 position.
 * @param {Integer} y2 The y2 position.
 * @returns {BoundingBox} A new bounding box.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.BoundingBox = function (x1, y1, x2, y2) {
    this.x1 = x1 || 0;
    this.y1 = y1 || 0;
    this.x2 = x2 || 0;
    this.y2 = y2 || 0;
};
webdiagrams.BoundingBox.prototype.constructor = webdiagrams.BoundingBox;
webdiagrams.BoundingBox.prototype.getX1 = function () {
    return this.x1;
};
webdiagrams.BoundingBox.prototype.setX1 = function (x1) {
    this.x1 = x1;
};
webdiagrams.BoundingBox.prototype.getY1 = function () {
    return this.y1;
};
webdiagrams.BoundingBox.prototype.setY1 = function (y1) {
    this.y1 = y1;
};
webdiagrams.BoundingBox.prototype.getX2 = function () {
    return this.x2;
};
webdiagrams.BoundingBox.prototype.setX2 = function (x2) {
    this.x2 = x2;
};
webdiagrams.BoundingBox.prototype.getY2 = function () {
    return this.y2;
};
webdiagrams.BoundingBox.prototype.setY2 = function (y2) {
    this.y2 = y2;
};
webdiagrams.BoundingBox.prototype.contains = function (x, y) {
    return (x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2);
};