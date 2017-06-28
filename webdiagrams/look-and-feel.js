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
        if (!lookAndFeelSingleton) {
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
        if (element instanceof Circle) {
            return new DefaultCircleDrawer();
        } else if (element instanceof Ellipse) {
            return new DefaultEllipseDrawer();
        } else if (element instanceof Rectangle) {
            return new DefaultRectangleDrawer();
        } else if (element instanceof Text) {
            return new DefaultTextDrawer();
        } else if (element instanceof VerticalGroup) {
            return new DefaultVerticalGroupDrawer();
        } else if (element instanceof Line) {
            return new DefaultLineDrawer();
        }
    }

}

class DefaultDrawer {

    constructor(svgArea) {
        this._svgArea = svgArea;
    }

    get svgArea() {
        return this._svgArea;
    }

    set svgArea(value) {
        this._svgArea = value;
    }

}

class DefaultCircleDrawer extends DefaultDrawer {

    draw(element) {
        let newCircle = document.createElementNS(this.svgArea.namespace, "circle");
        newCircle.setAttributeNS(null, "id", element.id);
        newCircle.setAttributeNS(null, "cx", element.centerX);
        newCircle.setAttributeNS(null, "cy", element.centerY);
        newCircle.setAttributeNS(null, "r", element.radius);
        newCircle.setAttributeNS(null, "style", element.stylingAttributes.toString());
        newCircle.setAttributeNS(null, "shape-rendering", "geometricPrecision");
        return newCircle;
    }

}

class DefaultEllipseDrawer extends DefaultDrawer {

    draw(element) {
        let newEllipse = document.createElementNS(this.svgArea.namespace, "ellipse");
        newEllipse.setAttributeNS(null, "id", element.id);
        newEllipse.setAttributeNS(null, "cx", element.centerX);
        newEllipse.setAttributeNS(null, "cy", element.centerY);
        newEllipse.setAttributeNS(null, "rx", element.radiusX);
        newEllipse.setAttributeNS(null, "ry", element.radiusY);
        newEllipse.setAttributeNS(null, "style", element.stylingAttributes.toString());
        newEllipse.setAttributeNS(null, "shape-rendering", "geometricPrecision");
        return newEllipse;
    }

}

class DefaultRectangleDrawer extends DefaultDrawer {

    draw(element) {
        let newRectangle = document.createElementNS(this.svgArea.namespace, "rect");
        newRectangle.setAttributeNS(null, "id", element.id);
        newRectangle.setAttributeNS(null, "x", element.x);
        newRectangle.setAttributeNS(null, "y", element.y);
        newRectangle.setAttributeNS(null, "width", element.width);
        newRectangle.setAttributeNS(null, "height", element.height);
        newRectangle.setAttributeNS(null, "style", element.stylingAttributes.toString());
        newRectangle.setAttributeNS(null, "shape-rendering", "geometricPrecision");
        return newRectangle;
    }

}

class DefaultTextDrawer extends DefaultDrawer {

    draw(element) {
        let newText = document.createElementNS(this.svgArea.namespace, "text");
        newText.setAttribute("id", element.id);

        newText.setAttribute("x", element.x);
        // The hanging baseline-alignment was not working equally on all browsers.
        // Because of that, the alignment was changed to baseline and now the
        // text must be drawn based on its bottom y coordinate.

        // (-4) was used because the text was showing a little bit down than it should be.
        // Only god knows why.
        newText.setAttribute("y", element.y + element.height - 4);

        newText.setAttribute("font-family", element.fontStylingAttributes.family);
        newText.setAttribute("font-size", element.fontStylingAttributes.size);
        newText.setAttribute("font-weight", element.fontStylingAttributes.weight);
        newText.setAttribute("font-style", element.fontStylingAttributes.style);
        newText.setAttribute("alignment-baseline", "baseline");
        newText.setAttribute("dominant-baseline", "baseline");
        newText.setAttribute("text-anchor", "start");
        newText.setAttribute("style", element.stylingAttributes.toString());
        newText.setAttribute("text-rendering", "optimizeLegibility");

        var textNode = document.createTextNode(element.text);
        newText.appendChild(textNode);

        return newText;
    }

}

class DefaultLineDrawer extends DefaultDrawer {

    draw(element) {
        let newLine = document.createElementNS(this.svgArea.namespace, "line");
        newLine.setAttributeNS(null, "id", element.id);
        newLine.setAttributeNS(null, "x1", element.x1);
        newLine.setAttributeNS(null, "y1", element.y1);
        newLine.setAttributeNS(null, "x2", element.x2);
        newLine.setAttributeNS(null, "y2", element.y2);
        newLine.setAttributeNS(null, "style", element.stylingAttributes.toString());
        newLine.setAttributeNS(null, "shape-rendering", "geometricPrecision");
        return newLine;
    }

}

class DefaultVerticalGroupDrawer extends DefaultDrawer {

    draw(element) {
        var newGroup = document.createElementNS(this.svgArea.namespace, "g");
        newGroup.setAttributeNS(null, "id", element.id);
        newGroup.setAttribute('shape-rendering', 'inherit');
        newGroup.setAttribute('pointer-events', 'all');

        let lookAndFeel = new LookAndFeel();

        if (element.frame !== null) {
            let drawer = lookAndFeel.getDrawerFor(element.frame);
            drawer.svgArea = this.svgArea;
            var drawedChild = drawer.draw(element.frame);
            child.drawed = drawedChild;
        }

        let i = 0;
        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            let drawer = lookAndFeel.getDrawerFor(child);
            drawer.svgArea = this.svgArea;
            var drawedChild = drawer.draw(child);
            child.drawed = drawedChild;
        }

        return newGroup;
    }

}