/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

class Primitive {

    constructor(x = 0, y = 0, width = 50, height = 50, stylingAttributes = new StylingAttributes(), id) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._stylingAttributes = stylingAttributes;
        this._id = id;
        this._drawed = null;
        this._changerListener = null;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
        this.changerListener.changeX(this, value);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.changerListener.changeY(this, value);
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.changerListener.changeWidth(this, value);
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.changerListener.changeHeight(this, value);
    }

    get stylingAttributes() {
        return this._stylingAttributes;
    }

    set stylingAttributes(value) {
        this._stylingAttributes = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get drawed() {
        return this._drawed;
    }

    set drawed(value) {
        this._drawed = value;
    }

    get changerListener() {
        return this._changerListener;
    }

    set changerListener(value) {
        this._changerListener = value;
    }

    move(newX, newY) {
        this.changerListener.changePosition(this, newX, newY);
    }

    attr(json) {
        this.changerListener.changeStylingAttributes(this, json);
    }

}

class Circle extends Primitive {

    constructor(centerX = 0, centerY = 0, radius = 50, stylingAttributes) {
        super(centerX - radius, centerY - radius, radius * 2, radius * 2, stylingAttributes);
        this._centerX = centerX;
        this._centerY = centerY;
        this._radius = radius;
    }

    set x(value) {
        this._centerX = value + this._radius;
        return super.x = value;
    }

    set y(value) {
        this._centerY = value + this._radius;
        return super.y = value;
    }

    set width(value) {
        this._radius = value / 2;
        return super.width = value;
    }

    set height(value) {
        this._radius = value / 2;
        return super.height = value;
    }

    get centerX() {
        return this._centerX;
    }

    set centerX(value) {
        super.x = value - this._radius;
        this._centerX = value;
    }

    get centerY() {
        return this._centerY;
    }

    set centerY(value) {
        super.y = value - this._radius;
        this._centerY = value;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        super.width = value * 2;
        super.height = value * 2;
        this._radius = value;
    }
}

class Ellipse extends Primitive {

    constructor(centerX = 0, centerY = 0, radiusX = 50, radiusY = 25, stylingAttributes) {
        super(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2, stylingAttributes);
        this._centerX = centerX;
        this._centerY = centerY;
        this._radiusX = radiusX;
        this._radiusY = radiusY;
    }

    set x(value) {
        this._centerX = value + this._radius;
        return super.x = value;
    }

    set y(value) {
        this._centerY = value + this._radius;
        return super.y = value;
    }

    set width(value) {
        this._radiusX = value / 2;
        return super.width = value;
    }

    set height(value) {
        this._radiusY = value / 2;
        return super.height = value;
    }

    get centerX() {
        return this._centerX;
    }

    set centerX(value) {
        super.x = value - this._radiusX;
        this._centerX = value;
    }

    get centerY() {
        return this._centerY;
    }

    set centerY(value) {
        super.y = value - this._radiusY;
        this._centerY = value;
    }

    get radiusX() {
        return this._radiusX;
    }

    set radiusX(value) {
        this._radiusX = value;
    }

    get radiusY() {
        return this._radiusY;
    }

    set radiusY(value) {
        this._radiusY = value;
    }

}

class Rectangle extends Primitive {

    constructor(x1 = 10, y1 = 10, x2 = 100, y2 = 20, stylingAttributes) {
        super(x1, y1, x2-x1, y2-y1, stylingAttributes);
    }

}

class Text extends Primitive {

    constructor(x = 10, y = 10, text = "Text", stylingAttributes) {
        super(x, y, undefined, undefined, stylingAttributes);
        this._text = text;
    }

    get width() {
        let boundingBox = this.drawed.getBBox();
        return boundingBox.width;
    }

    get height() {
        let boundingBox = this.drawed.getBBox();
        return boundingBox.height;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        this.changerListener.changeText(this, value);
    }

}

class StylingAttributes {

    constructor(strokeWidth = 1, strokeColor = 'black', fillColor = 'blue') {
        this._strokeWidth = strokeWidth;
        this._strokeColor = strokeColor;
        this._fillColor = fillColor;
    }

    get strokeWidth() {
        return this._strokeWidth;
    }

    set strokeWidth(value) {
        this._strokeWidth = value;
    }

    get strokeColor() {
        return this._strokeColor;
    }

    set strokeColor(value) {
        this._strokeColor = value;
    }

    get fillColor() {
        return this._fillColor;
    }

    set fillColor(value) {
        this._fillColor = value;
    }

    toString() {
        return "stroke:" + this.strokeColor + "; fill: " + this.fillColor + "; stroke-width: " + this.strokeWidth;
    }

}