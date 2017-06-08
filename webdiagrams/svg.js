/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

class SVGArea {

    constructor(svgSelector = "#svg") {
        this._idCount = 1;
        this._svg = document.querySelector(svgSelector);
        this._namespace = "http://www.w3.org/2000/svg";
        this._elements = new Map();
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

    addElement(key, value) {
        this._elements.set(key, value);
    }

    circle(centerX = 50, centerY = 50, radius = 100) {
        let newCircle = new Circle(centerX, centerY, radius);
        newCircle.id = this.generateId();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newCircle);
        drawer.svgArea = this;
        var drawedCircle = drawer.draw(newCircle);
        this.svg.appendChild(drawedCircle);

        return this.addElement(drawedCircle, newCircle);
    }

}
