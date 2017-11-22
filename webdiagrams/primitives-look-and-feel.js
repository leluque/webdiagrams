/**
 * Created by Leandro Luque on 08/06/2017.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

let lookAndFeelSingleton = null;

/**
 * This class implements a singleton that contains a factory created to return
 * drawers for geometric elements based on a specific look and feel.
 * If no look and feel factory is passed as an argument, a default one is adopted.
 */
class LookAndFeel {

    constructor(lookAndFeelFactory = new DefaultLookAndFeelFactory()) {
        if (!lookAndFeelSingleton) {
            lookAndFeelSingleton = this;

            this._lookAndFeelFactory = lookAndFeelFactory;
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

/**
 * This class implements a default look and feel factory.
 */
class DefaultLookAndFeelFactory {

    getDrawerFor(element) {
        if (element instanceof Circle) {
            return new DefaultCircleDrawer();
        } else if (element instanceof Ellipse) {
            return new DefaultEllipseDrawer();
        } else if (element instanceof Rectangle) {
            return new DefaultRectangleDrawer();
        } else if (element instanceof Diamond) {
            return new DefaultDiamondDrawer();
        } else if (element instanceof Text) {
            return new DefaultTextDrawer();
        } else if (element instanceof VerticalGroup) {
            return new DefaultVerticalGroupDrawer();
        } else if (element instanceof LinearGroup) {
            return new DefaultLinearGroupDrawer();
        } else if (element instanceof Line) {
            return new DefaultLineDrawer();
        } else if (element instanceof Image) {
            return new DefaultImageDrawer();
        }
    }

}

class DefaultCircleDrawer extends DefaultDrawer {

    draw(element) {
        let newCircle = document.createElementNS(this.svgArea.namespace, "circle");
        newCircle.setAttribute("id", element.id);
        newCircle.setAttribute("cx", element.centerX);
        newCircle.setAttribute("cy", element.centerY);
        newCircle.setAttribute("r", element.radius);
        newCircle.setAttribute("style", element.stylingAttributes.toString());
        newCircle.setAttribute("shape-rendering", "geometricPrecision");
        return newCircle;
    }

}

class DefaultEllipseDrawer extends DefaultDrawer {

    draw(element) {
        let newEllipse = document.createElementNS(this.svgArea.namespace, "ellipse");
        newEllipse.setAttribute("id", element.id);
        newEllipse.setAttribute("cx", element.centerX);
        newEllipse.setAttribute("cy", element.centerY);
        newEllipse.setAttribute("rx", element.radiusX);
        newEllipse.setAttribute("ry", element.radiusY);
        newEllipse.setAttribute("style", element.stylingAttributes.toString());
        newEllipse.setAttribute("shape-rendering", "geometricPrecision");
        return newEllipse;
    }

}

class DefaultRectangleDrawer extends DefaultDrawer {

    draw(element) {
        let newRectangle = document.createElementNS(this.svgArea.namespace, "rect");
        newRectangle.setAttribute("id", element.id);
        newRectangle.setAttribute("x", element.x);
        newRectangle.setAttribute("y", element.y);
        newRectangle.setAttribute("width", element.width);
        newRectangle.setAttribute("height", element.height);
        newRectangle.setAttribute("style", element.stylingAttributes.toString());
        newRectangle.setAttribute("shape-rendering", "geometricPrecision");
        return newRectangle;
    }

}

class DefaultDiamondDrawer extends DefaultDrawer {

    draw(element) {
        let newDiamond = document.createElementNS(this.svgArea.namespace, "path");
        newDiamond.setAttribute("id", element.id);
        let middleX = element.x + element.width / 2;
        let middleY = element.y + element.height / 2;
        let coordinates = "M " + element.x + "," + middleY;
        coordinates += " " + middleX + "," + element.y;
        coordinates += " " + (element.x + element.width) + "," + middleY;
        coordinates += " " + middleX + "," + (element.y + element.height);
        // The left diamond corner was not being drawn correctly because of the border.
        // To correct that, it was necessary to use the Pythagoras' theorem to move
        // a little bit up.
        let adjustment = Math.sqrt(element.borderSize * element.borderSize / 2);
        coordinates += " " + (element.x - adjustment) + "," + (middleY - adjustment);
        newDiamond.setAttribute("d", coordinates);
        newDiamond.setAttribute("style", element.stylingAttributes.toString());
        newDiamond.setAttribute("shape-rendering", "geometricPrecision");
        return newDiamond;
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

        // 3/4 was used because the bottom-line alignment put the bottom part of
        // letters such as p and q bellow the line.
        newText.setAttribute("y", element.y + 3 * element.height / 4);

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
        newLine.setAttribute("id", element.id);
        // (-borderSize) was used because (+borderSize * 2) was used at line constructor so that the line has at least one pixel even if their initial and final coordinate are equal.
        // The difference between no product and * 2 is necessary to center the line.
        newLine.setAttribute("x1", element.x1 + element.borderSize);
        newLine.setAttribute("y1", element.y1 + element.borderSize);
        newLine.setAttribute("x2", element.x2 - element.borderSize);
        newLine.setAttribute("y2", element.y2 - element.borderSize);
        newLine.setAttribute("style", element.stylingAttributes.toString());
        newLine.setAttribute("shape-rendering", "geometricPrecision");
        return newLine;
    }

}

class DefaultImageDrawer extends DefaultDrawer {

    draw(element) {
        let newImage = document.createElementNS(this.svgArea.namespace, "image");
        newImage.setAttribute("id", element.id);
        newImage.setAttribute("x", element.x);
        newImage.setAttribute("y", element.y);
        newImage.setAttribute("width", element.width);
        newImage.setAttribute("height", element.height);
        newImage.setAttribute("style", element.stylingAttributes.toString());
        newImage.setAttribute("visibility", "visible");
        newImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', element.image);
        return newImage;
    }

}

class DefaultVerticalGroupDrawer extends DefaultDrawer {

    draw(element) {
        var newGroup = document.createElementNS(this.svgArea.namespace, "g");
        newGroup.setAttribute("id", element.id);
        newGroup.setAttribute('shape-rendering', 'inherit');
        newGroup.setAttribute('pointer-events', 'all');

        let lookAndFeel = new LookAndFeel();

        if (element.frame !== null) {
            let drawer = lookAndFeel.getDrawerFor(element.frame);
            drawer.svgArea = this.svgArea;
            var drawnFrame = drawer.draw(element.frame);
            element.frame.drawn = drawnFrame;
            newGroup.appendChild(drawnFrame);
        }

        let i = 0;
        for (i = 0; i < element.countChildren(); i++) {
            let child = element.getChildAt(i);
            let drawer = lookAndFeel.getDrawerFor(child);
            drawer.svgArea = this.svgArea;
            var drawnChild = drawer.draw(child);
            child.drawn = drawnChild;
            newGroup.appendChild(drawnChild);
        }

        return newGroup;
    }

}

class DefaultLinearGroupDrawer extends DefaultDrawer {

    draw(element) {
        var newGroup = document.createElementNS(this.svgArea.namespace, "g");
        newGroup.setAttribute("id", element.id);
        newGroup.setAttribute('shape-rendering', 'inherit');
        newGroup.setAttribute('pointer-events', 'all');

        let lookAndFeel = new LookAndFeel();

        if (element.verticalGroup.frame !== null) {
            let drawer = lookAndFeel.getDrawerFor(element.verticalGroup.frame);
            drawer.svgArea = this.svgArea;
            var drawnFrame = drawer.draw(element.verticalGroup.frame);
            element.verticalGroup.frame.drawn = drawnFrame;
            newGroup.appendChild(drawnFrame);
        }

        let i = 0;
        for (i = 0; i < element.verticalGroup.countChildren(); i++) {
            let child = element.verticalGroup.getChildAt(i);
            let drawer = lookAndFeel.getDrawerFor(child);
            drawer.svgArea = this.svgArea;
            var drawnChild = drawer.draw(child);
            child.drawn = drawnChild;
            newGroup.appendChild(drawnChild);
        }

        return newGroup;
    }

}
