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
        return this.x + (this.width / 2);
    }

    get centerY() {
        return this.y + (this.height / 2);
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
    }

    get width() {
        return super.width;
    }

    set width(value) {
        this.width = value;
        this.changerListener.changeRadiusX(this);
    }

    get height() {
        return super.height;
    }

    set height(value) {
        this.height = value;
        this.changerListener.changeRadiusY(this);
    }

    get centerX() {
        return this.x + (this.width / 2);
    }

    set centerX(value) {
        this.x = value - (this.width / 2);
    }

    get centerY() {
        return this.y + (this.height / 2);
    }

    set centerY(value) {
        this.y = value - (this.height / 2);
    }

    get radiusX() {
        return this.width / 2;
    }

    set radiusX(value) {
        this.width = value * 2;
    }

    get radiusY() {
        return this.height / 2;
    }

    set radiusY(value) {
        this.height = value * 2;
    }

}

class Rectangle extends GeometricShape {

    constructor(x1 = 10, y1 = 10, x2 = 100, y2 = 20, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    get contentX1() {
        return this.x + this.stylingAttributes.strokeWidth;
    }

    get contentY1() {
        return this.y + this.stylingAttributes.strokeWidth;
    }

    get contentX2() {
        return this.x + this.width - this.stylingAttributes.strokeWidth;
    }

    get contentY2() {
        return this.y + this.height - this.stylingAttributes.strokeWidth;
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

    set width(value) {
        super.width = value;
    }

    get height() {
        let boundingBox = this.drawed.getBBox();
        return boundingBox.height;
    }

    set height(value) {
        super.height = value;
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
        return this.x;
    }

    get y1() {
        return this.y;
    }

    get x2() {
        return this.x1 + this.width;
    }

    get y2() {
        return this.y1 + this.height;
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
        return this._x;
    }

    set x(value) {
        // Recalculate all children x coordinate.
        let i = 0;
        let newX = value;

        if (this.frame !== null) {
            this.frame.x = this.x;
            //newX = this.frame.contentX1();
        }
        newX += this.groupStylingAttributes.horMargin;

        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            child.x = newX;
            this.changerListener.changePosition(child);
        }
        this.x = value;
        this.changerListener.changePosition(this);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        // Recalculate all children y coordinate.
        let i = 0;
        let currentY = value;

        if (this.frame !== null) {
            this.frame.y = this.y;
            //currentY = this.frame.contentY1();
        }
        currentY += this.groupStylingAttributes.verMargin;

        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            child.y = currentY;
            currentY += child.height + this.groupStylingAttributes.verMargin;
            this.changerListener.changePosition(child);
        }
        this.y = value;
        this.changerListener.changePosition(this);
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
        return maxWidth;
    }

    set width(value) {
        let requiredWidth = this.width;
        if (requiredWidth < value) {
            return;
        }
        this.frame.width += (value - requiredWidth);
        this.changerListener.changeDimensions(this.frame);
        super.width = value;
    }

    get height() {
        let totalHeight = 0;
        let i = 0;
        for (i = 0; i < this.countChildren(); i++) {
            totalHeight += this.groupStylingAttributes.verMargin + this.getChildAt(i).height;
        }
        totalHeight += this.groupStylingAttributes.verMargin + 2 * this.stylingAttributes.strokeWidth;
        return totalHeight;
    }

    set height(value) {
        let requiredHeight = this.height;
        if (requiredHeight > value) {
            return;
        }
        this.frame.height += (value - requiredHeight);
        this.changerListener.changeDimensions(this.frame);
        super.height = value;
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
            this.changerListener.changePosition(this.frame);
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
        this.frame.x = this.x;
        this.frame.y = this.y;
        this.frame.width = this.width;
        this.frame.height = this.height;
        this.changerListener.changePosition(this._frame);
        this.changerListener.changeDimensions(this._frame);
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