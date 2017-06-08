/**
 * Created by Leandro Luque on 08/06/2017.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

let lookAndFeelSingleton = null;

class LookAndFeel {

    constructor() {
        if(!lookAndFeelSingleton) {
            lookAndFeelSingleton = this;

            this._lookAndFeelFactory = new DefaultLookAndFeelFactory();
        }

        return lookAndFeelSingleton;
    }

    get lookAndFeelFactory() {
        return this._lookAndFeelFactory;
    }

    set lookAndFeelFactory(value) {
        this._lookAndFeelFactory = value;
    }

    getDrawerFor(element) {
        return this._lookAndFeelFactory.getDrawerFor(element);
    }

}

class DefaultLookAndFeelFactory {

    getDrawerFor(element) {
        if(element instanceof Circle) {
            return new DefaultCircleDrawer();
        }
    }

}

class DefaultCircleDrawer {

    constructor(svgArea) {
        this._svgArea = svgArea;
    }

    get svgArea() {
        return this._svgArea;
    }

    set svgArea(value) {
        this._svgArea = value;
    }

    draw(element) {
        let newCircle = document.createElementNS(this._svgArea.namespace, "circle");
        newCircle.setAttributeNS(null, "id", element.id);
        newCircle.setAttributeNS(null, "cx", element.centerX);
        newCircle.setAttributeNS(null, "cy", element.centerY);
        newCircle.setAttributeNS(null, "r", element.radius);
        newCircle.setAttributeNS(null, "fill", element.stylingAttributes.fillColor);
        return newCircle;
    }

}