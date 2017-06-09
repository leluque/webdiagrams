/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

class GeometricShape {

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
        this.changerListener.changeX(this);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.changerListener.changeY(this);
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.changerListener.changeWidth(this);
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.changerListener.changeHeight(this);
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

class Circle extends GeometricShape {

    constructor(centerX = 0, centerY = 0, radius = 50, stylingAttributes) {
        super(centerX - radius, centerY - radius, radius * 2, radius * 2, stylingAttributes);
    }

    get centerX() {
        return this.x + (this.radius / 2);
    }

    get centerY() {
        return this.y + (this.radius / 2);
    }

    get radius() {
        return this.width / 2;
    }

    get halfSquare() {
        let diagonal = this.radius - this.stylingAttributes.strokeWidth;
        return Math.sqrt(diagonal * diagonal / 2);
    }

    get contentX1() {
        return this.x + this.radius - this.halfSquare;
    }

    get contentY1() {
        return this.contentX1;
    }

    get contentX2() {
        return this.contentX1 + 2 * this.halfSquare;
    }

    get contentY2() {
        return this.contentX2();
    }

}

class Ellipse extends GeometricShape {

    constructor(centerX = 0, centerY = 0, radiusX = 50, radiusY = 25, stylingAttributes) {
        super(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2, stylingAttributes);
        this._centerX = centerX;
        this._centerY = centerY;
        this._radiusX = radiusX;
        this._radiusY = radiusY;
    }

    set x(value) {
        this.centerX = value + this.radius;
        return super.x = value;
    }

    set y(value) {
        this.centerY = value + this.radius;
        return super.y = value;
    }

    set width(value) {
        this.radiusX = value / 2;
        this.changerListener.changeRadiusX(this);
        return super.width = value;
    }

    set height(value) {
        this.radiusY = value / 2;
        this.changerListener.changeRadiusY(this);
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

class Rectangle extends GeometricShape {

    constructor(x1 = 10, y1 = 10, x2 = 100, y2 = 20, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    get contentX1() {
        return super.x + this.stylingAttributes.strokeWidth;
    }

    get contentY1() {
        return super.y + this.stylingAttributes.strokeWidth;
    }

    get contentX2() {
        return super.x + super.width - this.stylingAttributes.strokeWidth;
    }

    get contentY2() {
        return super.y + super.height - this.stylingAttributes.strokeWidth;
    }

}

class Text extends GeometricShape {

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
        this.changerListener.changeText(this);
    }

}

class Line extends GeometricShape {

    constructor(x1 = 10, y1 = 10, x2 = 100, y2 = 10, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    get x1() {
        return super.x;
    }

    get y1() {
        return super.y;
    }

    get x2() {
        return this.x1 + super.width;
    }

    get y2() {
        return this.y1 + super.height;
    }

}

class VerticalGroup extends GeometricShape {

    // TODO: Correct circle as VerticalGroup frame.
    // TODO: Correct rectangle as VerticalGroup frame.
    // TODO: Implement resizingPolicy.

    constructor(x = 10, y = 10, stylingAttributes, groupStylingAttributes = new GroupStylingAttributes()) {
        super(x, y, undefined, undefined, stylingAttributes);
        this._groupStylingAttributes = groupStylingAttributes;
        this._children = [];
        this._resizingPolicy = [];
        this._frame = null;
    }

    get x() {
        return super.x;
    }

    set x(value) {
        // Recalculate all children x coordinate.
        let i = 0;
        let newX = value;

        if (this.frame !== null) {
            this.frame.x = this.x;
            newX = this.frame.contentX1();
        }
        newX += this.groupStylingAttributes.horMargin;

        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            child.x = newX;
        }
        return super.x = value;
    }

    get y() {
        return super.y;
    }

    set y(value) {
        // Recalculate all children y coordinate.
        let i = 0;
        let currentY = value;

        if (this.frame !== null) {
            this.frame.y = this.y;
            currentY = this.frame.contentY1();
        }
        currentY += this.groupStylingAttributes.verMargin;

        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            child.y = currentY;
            currentY += child.height + this.groupStylingAttributes.verMargin;
        }
        return super.y = value;
    }

    get width() {
        let maxWidth = 0;
        let i = 0;
        for (i = 0; i < this.countChildren(); i++) {
            if (this.getChildAt(i).width > maxWidth) {
                maxWidth = this.getChildAt(i).width;
            }
        }
        maxWidth += 2 * (this.groupStylingAttributes.horMargin + this.stylingAttributes.strokeWidth);
        this.frame.width = maxWidth;
        return maxWidth;
    }

    get height() {
        let totalHeight = 0;
        let i = 0;
        for (i = 0; i < this.countChildren(); i++) {
            totalHeight += this.groupStylingAttributes.verMargin + this.getChildAt(i).height;
        }
        totalHeight += this.groupStylingAttributes.verMargin + 2 * this.stylingAttributes.strokeWidth;
        this.frame.height = totalHeight;
        return totalHeight;
    }

    static get MATCH_PARENT() {
        return true;
    }

    static get WRAP_CONTENT() {
        return false;
    }

    get groupStylingAttributes() {
        return this._groupStylingAttributes;
    }

    set groupStylingAttributes(value) {
        this._groupStylingAttributes = value;
    }

    get children() {
        return this._children;
    }

    set children(value) {
        this._children = value;
    }

    get resizePolicy() {
        return this._resizingPolicy;
    }

    set resizePolicy(value) {
        this._resizingPolicy = value;
    }

    addChild(child, resizePolicy = this.WRAP_CONTENT) {
        this.children.push(child);
        this.resizePolicy.push(resizePolicy);
        child.x = this.x;
        if (this.countChildren() == 1) {
            child.y = this.y + this.groupStylingAttributes.verMargin;
        } else {
            var previousChild = this.getChildAt(this.countChildren() - 2);
            child.y = previousChild.y + previousChild.height + this.groupStylingAttributes.verMargin;
        }
        this.changerListener.changePosition(child);

        if (this.frame !== null) {
            this.frame.width = this.width;
            this.frame.height = this.height;
            this.changerListener.changeDimensions(this.frame);
        }
    }

    countChildren() {
        return this._children.length;
    }

    getChildAt(i) {
        return this._children[i];
    }

    get frame() {
        return this._frame;
    }

    set frame(value) {
        this._frame = value;
        this._frame.x = this.x;
        this._frame.y = this.y;
        this._frame.width = this.width;
        this._frame.height = this.height;
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

    toString() {
        return "stroke:" + this.strokeColor + "; fill: " + this.fillColor + "; stroke-width: " + this.strokeWidth;
    }

}

class GroupStylingAttributes {

    constructor(horMargin = 0, verMargin = 10) {
        this._horMargin = horMargin;
        this._verMargin = verMargin;
    }

    get horMargin() {
        return this._horMargin;
    }

    set horMargin(value) {
        this._horMargin = value;
    }

    get verMargin() {
        return this._verMargin;
    }

    set verMargin(value) {
        this._verMargin = value;
    }

}