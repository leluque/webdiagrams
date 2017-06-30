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

    // TODO: in all methods below, register listener events for all
    // relevant events and register Circle (or the appropriate class)
    // EVENThappened method as a callback function. This function
    // just inform the event listeners that the event happened.
    circle(centerX = 50, centerY = 50, radius = 100) {
        //*****************************
        // Create a new circle and set its id.
        let newCircle = new Circle(centerX, centerY, radius);
        newCircle.id = this.generateId();

        //*****************************
        // Add change listeners.
        newCircle.addChangeListener(new CircleDimensionChangeListener());
        newCircle.addChangeListener(new CirclePositionChangeListener());
        newCircle.addChangeListener(new StyleChangeListener());

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newCircle);
        drawer.svgArea = this;
        var drawnCircle = drawer.draw(newCircle);
        this.svg.appendChild(drawnCircle);

        newCircle.drawn = drawnCircle;

        return this.addElement(newCircle);
    }

    ellipse(centerX = 50, centerY = 50, radiusX = 100, radiusY = 50) {
        let newEllipse = new Ellipse(centerX, centerY, radiusX, radiusY);
        newEllipse.id = this.generateId();
        //newEllipse.changeListener = new SVGChanger();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newEllipse);
        drawer.svgArea = this;
        var drawnEllipse = drawer.draw(newEllipse);
        this.svg.appendChild(drawnEllipse);

        newEllipse.drawn = drawnEllipse;

        return this.addElement(newEllipse);
    }

    rect(x1 = 10, y1 = 10, x2 = 100, y2 = 20) {
        //*****************************
        // Create a new rectangle and set its id.
        let newRectangle = new Rectangle(x1, y1, x2, y2);
        newRectangle.id = this.generateId();

        //*****************************
        // Add change listeners.
        newRectangle.addChangeListener(new RectangleDimensionChangeListener());
        newRectangle.addChangeListener(new RectanglePositionChangeListener());
        newRectangle.addChangeListener(new StyleChangeListener());

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newRectangle);
        drawer.svgArea = this;
        var drawnRectangle = drawer.draw(newRectangle);
        this.svg.appendChild(drawnRectangle);

        newRectangle.drawn = drawnRectangle;

        return this.addElement(newRectangle);
    }

    text(x = 10, y = 10, text = "This is an example text", fontStylingAttributes = new FontStylingAttributes()) {
        //*****************************
        // Create a new text and set its id.
        let newText = new Text(x, y, text, undefined, fontStylingAttributes);
        newText.id = this.generateId();

        //*****************************
        // Add change listeners.
        newText.addChangeListener(new TextDimensionChangeListener());
        newText.addChangeListener(new TextPositionChangeListener());
        newText.addChangeListener(new TextChangeListener());
        newText.addChangeListener(new FontChangeListener());
        newText.addChangeListener(new StyleChangeListener());

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newText);
        drawer.svgArea = this;
        var drawnText = drawer.draw(newText);
        this.svg.appendChild(drawnText);

        newText.drawn = drawnText;
        newText.calculateDimensions();

        return this.addElement(newText);
    }

    image(x = 10, y = 10, width = 20, height = 20, image) {
        //*****************************
        // Create a new image and set its id.
        let newImage = new Image(x, y, width, height, image);
        newImage.id = this.generateId();

        //*****************************
        // Add change listeners.
        newImage.addChangeListener(new ImageDimensionChangeListener());
        newImage.addChangeListener(new ImagePositionChangeListener());
        newImage.addChangeListener(new StyleChangeListener());

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newImage);
        drawer.svgArea = this;
        var drawnText = drawer.draw(newImage);
        this.svg.appendChild(drawnText);

        newImage.drawn = drawnText;

        return this.addElement(newImage);
    }

    vgroup(x = 10, y = 10) {
        //*****************************
        // Create a new vertical group and set its id.
        let newVGroup = new VerticalGroup(x, y);
        newVGroup.id = this.generateId();

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newVGroup);
        drawer.svgArea = this;
        var drawnVGroup = drawer.draw(newVGroup);
        this.svg.appendChild(drawnVGroup);

        newVGroup.drawn = drawnVGroup;

        return this.addElement(newVGroup);
    }

    line(x1 = 10, y1 = 10, x2 = 100, y2 = 10) {
        //*****************************
        // Create a new line and set its id.
        let newLine = new Line(x1, y1, x2, y2);
        newLine.id = this.generateId();

        //*****************************
        // Add change listeners.
        newLine.addChangeListener(new LineDimensionChangeListener());
        newLine.addChangeListener(new LinePositionChangeListener());
        newLine.addChangeListener(new StyleChangeListener());

        let lookAndFeel = new LookAndFeel();
        let drawer = lookAndFeel.getDrawerFor(newLine);
        drawer.svgArea = this;
        var drawnLine = drawer.draw(newLine);
        this.svg.appendChild(drawnLine);

        newLine.drawn = drawnLine;

        return this.addElement(newLine);
    }

}

class GeneralPositionChangeListener extends ChangeListener {
    update(target) {
        this.changeX(target);
        this.changeY(target);
    }

    changeX(target) {
        target.drawn.setAttribute("x", target.x);
    }

    changeY(target) {
        target.drawn.setAttribute("y", target.y);
    }
}
class RectanglePositionChangeListener extends GeneralPositionChangeListener {
}
class ImagePositionChangeListener extends GeneralPositionChangeListener {
}
class TextPositionChangeListener extends GeneralPositionChangeListener {

    changeY(target) {
        // The hanging baseline-alignment was not working equally on all browsers.
        // Because of that, the alignment was changed to baseline and now the
        // text must be drawn based on its bottom y coordinate.

        target.drawn.setAttribute("y", (target.y + target.height));
    }

}
class LinePositionChangeListener extends GeneralPositionChangeListener {
    update(target) {
        target.drawn.setAttribute("x1", target.x1);
        target.drawn.setAttribute("y1", target.y1);
        target.drawn.setAttribute("x2", target.x2);
        target.drawn.setAttribute("y2", target.y2);
    }
}
class CirclePositionChangeListener extends GeneralPositionChangeListener {
    changeX(target) {
        target.drawn.setAttribute("cx", target.centerX);
    }

    changeY(target) {
        target.drawn.setAttribute("cy", target.centerY);
    }
}

class GeneralDimensionChangeListener extends ChangeListener {

    update(target) {
        this.changeWidth(target);
        this.changeHeight(target);
    }

    changeWidth(target) {
        target.drawn.setAttribute("width", target.width);
    }

    changeHeight(target) {
        target.drawn.setAttribute("height", target.height);
    }

}
class RectangleDimensionChangeListener extends GeneralDimensionChangeListener {
}
class ImageDimensionChangeListener extends GeneralDimensionChangeListener {
}
class TextDimensionChangeListener extends GeneralDimensionChangeListener {
}
class CircleDimensionChangeListener extends GeneralDimensionChangeListener {

    update(target) {
        super.update(target);
        this.changeRadius(target);
    }

    changeRadius(target) {
        target.drawn.setAttribute("r", target.radius);
    }

}
class LineDimensionChangeListener extends GeneralDimensionChangeListener {

    changeWidth(target) {
        target.drawn.setAttribute("x2", target.x2);
    }

    changeHeight(target) {
        target.drawn.setAttribute("y2", target.y2);
    }

}

class TextChangeListener extends ChangeListener {
    update(target) {
        target.drawn.textContent = target.text;
    }
}

class FontChangeListener extends ChangeListener {
    update(target) {
        target.drawn.setAttribute("font-family", target.fontStylingAttributes.family);
        target.drawn.setAttribute("font-size", target.fontStylingAttributes.size);
        target.drawn.setAttribute("font-weight", target.fontStylingAttributes.weight);
        target.drawn.setAttribute("font-style", target.fontStylingAttributes.style);
    }
}

class StyleChangeListener extends ChangeListener {
    update(target) {
        Object.assign(target.drawn.style, target.stylingAttributes.toJSON());
    }
}
