/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

class BoundingBox {

    constructor(x1 = 0, y1 = 0, x2 = 100, y2 = 100) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
    }

    get x1() {
        return this._x1;
    }

    set x1(value) {
        this._x1 = value;
    }

    get y1() {
        return this._y1;
    }

    set y1(value) {
        this._y1 = value;
    }

    get x2() {
        return this._x2;
    }

    set x2(value) {
        this._x2 = value;
    }

    get y2() {
        return this._y2;
    }

    set y2(value) {
        this._y2 = value;
    }

    get width() {
        return this.x2 - this.x1;
    }

    get height() {
        return this.y2 - this.y1;
    }

}

class ChangeListener {

    update(target) {
        // Update.
    }

}

/**
 * This class implements graphical elements.
 */
class GraphicalElement {

    constructor(x = 0, y = 0, width = 50, height = 50, stylingAttributes = new StylingAttributes(), id) {
        this._x = x;
        this._y = y;
        this._minWidth = 10;
        this._width = width;
        this._minHeight = 10;
        this._height = height;
        this._stylingAttributes = stylingAttributes;
        this._stylingAttributes.target = this; // Bidirectional navigation.
        this._id = id;
        this._drawn = null; // A reference to the shape drawn on an area.
        this._changeListeners = [];
        this._changeNotificationsEnabled = true;
    }

    disableChangeNotifications() {
        this._changeNotificationsEnabled = false;
    }

    enableChangeNotifications() {
        this._changeNotificationsEnabled = true;
    }

    get changeNotificationsEnabled() {
        return this._changeNotificationsEnabled;
    }

    set changeNotificationsEnabled(value) {
        this._changeNotificationsEnabled = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
        this.notifyListeners();
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.notifyListeners();
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.notifyListeners();
    }

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(value) {
        this._minWidth = value;
        if (this.width < this.minWidth) {
            this.width = this.minWidth;
        }
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.notifyListeners();
    }

    get minHeight() {
        return this._minHeight;
    }

    set minHeight(value) {
        this._minHeight = value;
        if (this.height < this.minHeight) {
            this.height = this.minHeight;
        }
    }

    get x2() {
        return this.x + this.width;
    }

    set x2(value) {
        if (value < this.x) {
            // Invert x1 and x2.
            let temp = this.x;
            this.x = value;
            this.width += temp - this.x;
        } else {
            this.width = value - this.x;
        }
    }

    get y2() {
        return this.y + this.height;
    }

    set y2(value) {
        if (value < this.y) {
            // Invert y1 and y2.
            let temp = this.y;
            this.y = value;
            this.height += temp - this.y;
        } else {
            this.height = value - this.y;
        }
    }

    get stylingAttributes() {
        return this._stylingAttributes;
    }

    set stylingAttributes(value) {
        this._stylingAttributes = value;
        value.target = this;
        this.notifyListeners();
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get drawn() {
        return this._drawn;
    }

    set drawn(value) {
        this._drawn = value;
    }

    moveTo(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
    }

    appearance(json) {
        this.stylingAttributes.fromJSON(json);
        this.notifyListeners();
    }

    /**
     * Returns a bounding box for the geometric shape content.
     * @returns A bounding box for the geometric shape content.
     */
    get contentBox() {
        return null;
    }

    /**
     * Returns the minimum width to fit the specified bounding box as its content.
     * @param boundingBox The content bounding box.
     * @returns The minimum width to fit the specified bounding box as its content.
     */
    widthToFit(boundingBox) {
        return null;
    }

    /**
     * Returns the minimum height to fit the specified bounding box as its content.
     * @param boundingBox The content bounding box.
     * @returns The minimum height to fit the specified bounding box as its content.
     */
    heightToFit(boundingBox) {
        return null;
    }

    get changeListeners() {
        return this._changeListeners;
    }

    set changeListeners(value) {
        this._changeListeners = value;
    }

    addChangeListener(value) {
        this._changeListeners.push(value);
    }

    notifyListeners() {
        if (!this.changeNotificationsEnabled) {
            return;
        }
        for (let listener of this.changeListeners) {
            listener.update(this);
        }
    }

}

class Circle extends GraphicalElement {

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

    get contentBox() {
        let involvingBoxHalfDiagonal = Math.sqrt(2 * Math.pow(this.width, 2)) / 2;
        let delta = involvingBoxHalfDiagonal - this.radius - this.stylingAttributes.strokeWidth;
        return new BoundingBox(this.x + delta, this.y + delta, this.x + this.width - delta, this.y + this.height - delta);
    }

    widthToFit(boundingBox) {
        let maxDimension = Math.max(boundingBox.x2 - boundingBox.x1, boundingBox.y2 - boundingBox.y1);
        let diameter = Math.sqrt(2 * Math.pow(maxDimension, 2)) + this.stylingAttributes.strokeWidth;
        return diameter;
    }

    heightToFit(boundingBox) {
        return this.widthToFit(boundingBox);
    }

}

// TODO: update notifiers.
// TODO: implement contentBox e width/heightToFit
class Ellipse extends GraphicalElement {

    constructor(centerX = 0, centerY = 0, radiusX = 50, radiusY = 25, stylingAttributes) {
        super(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2, stylingAttributes);
    }

    get width() {
        return super.width;
    }

    set width(value) {
        this.width = value;
        this.changeListeners.changeRadiusX(this);
    }

    get height() {
        return super.height;
    }

    set height(value) {
        this.height = value;
        this.changeListeners.changeRadiusY(this);
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

class Rectangle extends GraphicalElement {

    constructor(x1 = 10, y1 = 10, x2 = 100, y2 = 20, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    get contentBox() {
        // The stroke width is divided by 2 because its thickness is divided 50% to the left and 50% to the right.
        let border = this.stylingAttributes.strokeWidth / 2;
        return new BoundingBox(this.x + border, this.y + border, this.x + this.width - border, this.y + this.height - border);
    }

    widthToFit(boundingBox) {
        let boundingBoxWidth = boundingBox.x2 - boundingBox.x1;
        boundingBoxWidth += this.stylingAttributes.strokeWidth;
        return boundingBoxWidth;
    }

    heightToFit(boundingBox) {
        let boundingBoxHeight = boundingBox.y2 - boundingBox.y1;
        boundingBoxHeight += this.stylingAttributes.strokeWidth;
        return boundingBoxHeight;
    }

}

class Text extends GraphicalElement {

    constructor(x = 10, y = 10, text = "Text", stylingAttributes = new StylingAttributes(1, "black", "black"), fontStylingAttributes = new FontStylingAttributes()) {
        super(x, y, undefined, undefined, stylingAttributes);
        this._text = text;
        this._fontStylingAttributes = fontStylingAttributes;
        this._fontStylingAttributes.target = this;
    }

    get minWidth() {
        let boundingBox = this.drawn.getBBox();
        return boundingBox.width;
    }

    get minHeight() {
        let boundingBox = this.drawn.getBBox();
        return boundingBox.height;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        this.notifyListeners();
        this.calculateDimensions();
    }

    calculateDimensions() {
        try {
            this.width = this.minWidth;
            this.height = this.minHeight;
        }
        catch (error) {
        }
    }

    get fontStylingAttributes() {
        return this._fontStylingAttributes;
    }

    set fontStylingAttributes(value) {
        this._fontStylingAttributes = value;
        this.fontStylingAttributes.target = this;
        this.notifyListeners();
    }

}

class Line extends GraphicalElement {

    constructor(x1 = 10, y1 = 10, x2 = 1, y2 = 1, stylingAttributes = new StylingAttributes(1)) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    get x1() {
        return this.x;
    }

    set x1(value) {
        this.x = value;
    }

    get y1() {
        return this.y;
    }

    set y1(value) {
        this.y = value;
    }

    get minWidth() {
        if(this.stylingAttributes !== null) {
            return this.stylingAttributes.strokeWidth;
        }
        return 1;
    }

    get minHeight() {
        if(this.stylingAttributes !== null) {
            return this.stylingAttributes.strokeWidth;
        }
        return 1;
    }

}

class VerticalGroup extends GraphicalElement {

    // It does not use horizontal margins for elements.
    static get MATCH_PARENT() {
        return 2;
    }

    // It uses horizontal margins for elements.
    static get FILL_SPACE() {
        return 1;
    }

    static get WRAP_CONTENT() {
        return 0;
    }

    constructor(x = 0, y = 0, stylingAttributes, groupStylingAttributes = new GroupStylingAttributes()) {
        super(x, y, 1, 1, stylingAttributes);
        this._groupStylingAttributes = groupStylingAttributes;
        this._children = [];
        this._resizePolicy = [];
        this._frame = null;
        this._dimensionReadjustmentEnabled = true;
    }

    get x() {
        return super.x;
    }

    set x(value) {
        super.x = value;

        //*****************************
        // Recalculate all children's x coordinate.
        let contentBox = new BoundingBox(this.x, this.y, this.x2, this.y2);
        if (this.frame !== null) {
            this.frame.x = this.x;
            contentBox = this.frame.contentBox;
        }

        let newChildrenX = contentBox.x1;

        let i = 0;
        for (let child of this.children) {
            child.x = newChildrenX;
            if (this.resizePolicy[i] !== VerticalGroup.MATCH_PARENT) {
                child.x += this.horMargin;
            }
            i++;
        }
    }

    get y() {
        return super.y;
    }

    set y(value) {
        super.y = value;

        //*****************************
        // Recalculate all children's y coordinate.
        let contentBox = new BoundingBox(this.x, this.y, this.x2, this.y2);
        if (this.frame !== null) {
            this.frame.y = this.y;
            contentBox = this.frame.contentBox;
        }

        let currentChildrenY = contentBox.y1 + this.verMargin;

        for (let child of this.children) {
            child.y = currentChildrenY;
            currentChildrenY += child.height + this.verMargin;
        }
    }

    get width() {
        return super.width;
    }

    get minContentWidth() {
        let calcMinWidth = 0;
        let i = 0;
        for (let child of this.children) {
            if (child.minWidth > calcMinWidth) {
                calcMinWidth = child.minWidth;
                // MATCH_PARENT does not use horizontal margins for elements.
                // It is used for lines, for example.
                if (this.resizePolicy[i] !== VerticalGroup.MATCH_PARENT) {
                    calcMinWidth += 2 * this.horMargin;
                }
            }
            i++;
        }
        return calcMinWidth;
    }

    get minWidth() {
        let calcMinWidth = this.minContentWidth;

        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x + calcMinWidth, this.y2);
            let frameWidth = this.frame.widthToFit(boundingBox);
            return frameWidth;
        }
        return calcMinWidth;
    }

    set width(value) {
        this.disableDimensionReadjustment(); // Prevent stack overflow.
        let requiredWidth = this.minContentWidth;
        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x + requiredWidth, this.y2);
            requiredWidth = this.frame.widthToFit(boundingBox);
        }
        if (value < requiredWidth) { // Do not resize if the content does not fit the new width.
            return;
        }

        super.width = value;
        let availableWidthForChildren = this.width;
        if (this.frame !== null) {
            this.frame.width = this.width;
            let contentBox = this.frame.contentBox;
            availableWidthForChildren = contentBox.width;
        }

        // Adjust children's width (for children with certain resizing policies).
        let i = 0;
        for (i = 0; i < this.countChildren(); i++) {
            if (this.resizePolicy[i] === VerticalGroup.FILL_SPACE) {
                this.children[i].width = availableWidthForChildren - 2 * this.horMargin;
            } else if (this.resizePolicy[i] === VerticalGroup.MATCH_PARENT) {
                this.children[i].width = availableWidthForChildren;
            }
        }
        this.enableDimensionReadjustment(); // Prevent stack overflow.
    }

    get height() {
        return super.height;
    }

    get minHeight() {
        let calcMinHeight = 0;
        for (let child of this.children) {
            calcMinHeight += this.verMargin;
            calcMinHeight += child.height;
        }
        calcMinHeight += this.verMargin;
        return calcMinHeight;
    }

    set height(value) {
        let requiredHeight = this.minHeight;
        if (value < requiredHeight) {
            return;
        }
        super.height = value;

        if (this.frame !== null) {
            this.frame.height = value;
        }
    }

    increaseHeightBy(value) {
        super.height += value;

        if (this.frame !== null) {
            this.frame.height += value;
        }
    }

    get groupStylingAttributes() {
        return this._groupStylingAttributes;
    }

    set groupStylingAttributes(value) {
        this._groupStylingAttributes = value;
        this.notifyListeners();
    }

    get horMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.horMargin;
        }
        return 0;
    }

    get verMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.verMargin;
        }
        return 0;
    }

    get children() {
        return this._children;
    }

    set children(value) {
        this._children = [];
        for (let child of value) {
            this.add(child);
        }
    }

    get resizePolicy() {
        return this._resizePolicy;
    }

    addChild(child, resizePolicy = VerticalGroup.WRAP_CONTENT) {
        this.disableChangeNotifications(); // Avoid unnecessary change notifications.
        this.disableDimensionReadjustment(); // Avoid unnecessary readjustments.

        //*****************************
        // Increase the group height to fit the new child.
        let childRequiredHeight = child.height + this.verMargin;
        if (this.countChildren() == 0) { // Add another vertical margin to the first child.
            childRequiredHeight += this.verMargin;
        }
        this.increaseHeightBy(childRequiredHeight);

        //*****************************
        // Calculate the minimum width that the group must have to fit this new child in its content.
        let requiredGroupWidth = child.minWidth + 2 * this.horMargin;  // MARGIN + child + MARGIN.
        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x + requiredGroupWidth, this.y + this.height);
            requiredGroupWidth = this.frame.widthToFit(boundingBox);
        }

        //*****************************
        // Update the group width if necessary.
        if (this.width < requiredGroupWidth) {
            this.width = requiredGroupWidth;
        }

        //*****************************
        // Add to the group the child and its resizing policy.
        this.children.push(child);
        this.resizePolicy.push(resizePolicy);
        // Add the group as a child change listener.
        child.addChangeListener(new VerticalGroupChildChangeListener(this));

        //*****************************
        // Define the child x position and update the child width.
        let contentBox = new BoundingBox(this.x, this.y, this.x + this.width, this.y + this.height);
        if (this.frame !== null) {
            contentBox = this.frame.contentBox;
        }
        child.x = contentBox.x1;

        if (resizePolicy === VerticalGroup.WRAP_CONTENT) {
            child.x += this.horMargin;
        } else if (resizePolicy === VerticalGroup.FILL_SPACE) {
            child.x += this.horMargin;
            child.width = contentBox.width - 2 * this.horMargin;
        } else if (resizePolicy === VerticalGroup.MATCH_PARENT) {
            child.width = contentBox.width;
        }

        //*****************************
        // Define the child y position.
        if (this.countChildren() == 1) {
            child.y = contentBox.y1 + this.verMargin;
        } else {
            var previousChild = this.getChildAt(this.countChildren() - 2);
            child.y = previousChild.y + previousChild.height + this.verMargin;
        }

        this.notifyListeners();

        this.enableChangeNotifications(); // Enable change notifications.
        this.enableDimensionReadjustment(); // Enable dimension readjustments.
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
        this.disableChangeNotifications();
        this._frame = value;
        this.frame.x = this.x;
        this.frame.y = this.y;
        this.frame.width = this.width;
        this.frame.height = this.height;
        this.enableChangeNotifications();
        this.frame.notifyListeners();
        this.notifyListeners();
    }

    get borderSize() {
        if (this.frame !== null && this.frame.stylingAttributes !== null) {
            return this.frame.stylingAttributes.strokeWidth / 2;
        }
    }

    get dimensionReadjustmentEnabled() {
        return this._dimensionReadjustmentEnabled;
    }

    set dimensionReadjustmentEnabled(value) {
        this._dimensionReadjustmentEnabled = value;
    }

    disableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = false;
    }

    enableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = true;
    }

    readjustDimensions() {
        if (!this.dimensionReadjustmentEnabled) {
            return;
        }

        this.width = this.minWidth;
        this.height = this.minHeight;
    }

}

class VerticalGroupChildChangeListener extends ChangeListener {

    constructor(vgroup) {
        super();
        this._vgroup = vgroup;
    }

    get vgroup() {
        return this._vgroup;
    }

    set vgroup(value) {
        this._vgroup = value;
    }

    update(target) {
        this.vgroup.readjustDimensions();
    }

}

class StylingAttributes {

    constructor(strokeWidth = 3, strokeColor = 'black', fillColor = '#FFFFCC', target = null) {
        this._strokeWidth = strokeWidth;
        this._strokeColor = strokeColor;
        this._fillColor = fillColor;
        this._target = target;
    }

    get strokeWidth() {
        return this._strokeWidth;
    }

    set strokeWidth(value) {
        this._strokeWidth = value;
        this.notifyTarget();
    }

    get strokeColor() {
        return this._strokeColor;
    }

    set strokeColor(value) {
        this._strokeColor = value;
        this.notifyTarget();
    }

    get fillColor() {
        return this._fillColor;
    }

    set fillColor(value) {
        this._fillColor = value;
        this.notifyTarget();
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value;
    }

    fromJSON(json) {
        this.fillColor = json.fill;
        this.strokeColor = json.stroke;
        this.strokeWidth = json.strokeWidth;
    }

    toJSON() {
        return {fill: this.fillColor, stroke: this.strokeColor, strokeWidth: this.strokeWidth};
    }

    toString() {
        let style = "stroke:" + this.strokeColor + "; fill: " + this.fillColor + "; stroke-width: " + this.strokeWidth + ";";
        style += "-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;";
        return style;
    }

    notifyTarget() {
        if (this.target !== null) {
            this.target.notifyListeners();
        }
    }

}

class GroupStylingAttributes {

    constructor(horMargin = 10, verMargin = 10) {
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

class FontStylingAttributes {

    constructor(family = "sans-serif", size = 14, weight = "100", target = null) {
        this._family = family;
        this._size = size;
        this._weight = weight;
        this._target = target;
    }

    get family() {
        return this._family;
    }

    set family(value) {
        this._family = value;
        this.target.notifyListeners();
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
        this.target.notifyListeners();
    }

    get weight() {
        return this._weight;
    }

    set weight(value) {
        this._weight = value;
        this.target.notifyListeners();
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value;
        this.target.notifyListeners();
    }
}