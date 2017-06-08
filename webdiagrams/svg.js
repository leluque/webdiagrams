/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

let svgChanger = null;

class SVGArea {

    constructor(svgSelector = "#svg") {
        this._idCount = 1;
        this._svg = document.querySelector(svgSelector);
        this._namespace = "http://www.w3.org/2000/svg";
        this._elements = [];
    }

    get idCount() {
        return this._idCount;
    }

    set idCount(value) {
        this._idCount = value;
    }

    generateId() {
        return "element_" + (this._idCount++);
    }

    get svg() {
        return this._svg;
    }

    set svg(value) {
        this._svg = value;
    }

    get namespace() {
        return this._namespace;
    }

    set namespace(value) {
        this._namespace = value;
    }

    get elements() {
        return this._elements;
    }

    set elements(value) {
        this._elements = value;
    }

    addElement(element) {
        this._elements.push(element);
        return element;
    }

    circle(centerX = 50, centerY = 50, radius = 100) {
        let newCircle = new Circle(centerX, centerY, radius);
        newCircle.id = this.generateId();
        newCircle.changerListener = new SVGChanger();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newCircle);
        drawer.svgArea = this;
        var drawedCircle = drawer.draw(newCircle);
        this.svg.appendChild(drawedCircle);

        newCircle.drawed = drawedCircle;

        return this.addElement(newCircle);
    }

    ellipse(centerX = 50, centerY = 50, radiusX = 100, radiusY = 50) {
        let newEllipse = new Ellipse(centerX, centerY, radiusX, radiusY);
        newEllipse.id = this.generateId();
        newEllipse.changerListener = new SVGChanger();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newEllipse);
        drawer.svgArea = this;
        var drawedEllipse = drawer.draw(newEllipse);
        this.svg.appendChild(drawedEllipse);

        newEllipse.drawed = drawedEllipse;

        return this.addElement(newEllipse);
    }

    rect(x1 = 10, y1 = 10, x2 = 100, y2 = 20) {
        let newRectangle = new Rectangle(x1, y1, x2, y2);
        newRectangle.id = this.generateId();
        newRectangle.changerListener = new SVGChanger();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newRectangle);
        drawer.svgArea = this;
        var drawedRectangle = drawer.draw(newRectangle);
        this.svg.appendChild(drawedRectangle);

        newRectangle.drawed = drawedRectangle;

        return this.addElement(newRectangle);
    }

}

class SVGChanger {

    constructor() {
        if (!svgChanger) {
            svgChanger = this;
        }

        return svgChanger;
    }

    changePosition(element, newX, newY) {
        this.changeX(element, newX);
        this.changeY(element, newY);
    }

    changeX(element, newX) {
        element.drawed.setAttribute("x", newX);
    }

    changeY(element, newY) {
        element.drawed.setAttribute("y", newY);
    }

    changeWidth(element, newWidth) {
        element.drawed.setAttribute("width", newWidth);
    }

    changeHeight(element, newHeight) {
        element.drawed.setAttribute("height", newHeight);
    }

    changeStylingAttributes(element, json) {
        Object.assign(element.drawed.style, json);
    }

}
