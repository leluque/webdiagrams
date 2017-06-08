/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

class Primitive {

    constructor(x = 0, y = 0, width = 50, height = 50, stylingAttributes = new StylingAttributes()) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._stylingAttributes = stylingAttributes;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get stylingAttributes() {
        return this._stylingAttributes;
    }

    set stylingAttributes(value) {
        this._stylingAttributes = value;
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
        this._radius = value/2;
        return super.width = value;
    }

    set height(value) {
        this._radius = value/2;
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

class StylingAttributes {

    constructor(strokeWidth = 1, strokeColor = 'black', fillColor = 'white') {
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

}