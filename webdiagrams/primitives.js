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
        this.changeNotificationsEnabled = false;
    }

    enableChangeNotifications() {
        this.changeNotificationsEnabled = true;
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
    contentBox(width, height) {
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
        return this.y + (this.width / 2);
    }

    get radius() {
        return this.width / 2;
    }

    get width() {
        return super.width;
    }

    set width(value) {
        this.disableChangeNotifications();
        super.height = value;
        this.enableChangeNotifications();
        super.width = value;
    }

    get height() {
        return super.height;
    }

    set height(value) {
        this.disableChangeNotifications();
        super.width = value;
        this.enableChangeNotifications();
        super.height = value;
    }


    contentBox(width = 1, height = 1) {
        //*****************************
        // The previous algorithm was supposing a squared content box. Nonetheless, some contents are rectangular and
        // if the ration between the content width/height is not considered, this method may conflict with
        // the method width to fit that takes this ratio into consideration.
        // It was being observed for circles with text inside (a graph node for example).

        //let involvingBoxHalfDiagonal = Math.sqrt(2 * Math.pow(this.width, 2)) / 2;
        //let deltaDiagonal = involvingBoxHalfDiagonal - this.radius;
        //let delta = Math.sqrt(deltaDiagonal * deltaDiagonal) / 2;
        //return new BoundingBox(this.x + delta, this.y + delta, this.x + this.width - delta, this.y + this.height - delta);
        //*****************************

        // Take into consideration the ratio among width and height.
        // FORMULA:
        // (width/2)^2 + (height/2)^2 = radius^2
        // (width/2)^2 + (width/ratio/2)^2 = radius^2
        // (width/2)^2 + (width/2*ratio)^2 = radius^2
        // if z = width/2 | z^2 + ((1/ratio)*z)^2 = radius^2
        // (1 + (1/ratio)^2) z^2 = radius^2
        // z = sqrt(radius^2/ (1 + (1/ratio)^2))

        let ratio = width / height;
        let squaredRadius = this.radius * this.radius;
        let halfWidth = Math.sqrt(squaredRadius / (1 + Math.pow(1 / ratio, 2)));
        let halfHeight = halfWidth / ratio;
        let deltaX = this.radius - halfWidth;
        let deltaY = this.radius - halfHeight;

        let contentBox = new BoundingBox(this.x + deltaX, this.y + deltaY, this.x + this.width - deltaX, this.y + this.height - deltaY);

        return contentBox;
    }

    widthToFit(boundingBox) {
        let diameter = Math.sqrt(Math.pow(boundingBox.width, 2) + Math.pow(boundingBox.height, 2));
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

    contentBox(width, height) { // For rectangles, it does not matter the current width/height of a group they may be a frame of.
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
        if (this.stylingAttributes !== null) {
            return this.stylingAttributes.strokeWidth;
        }
        return 1;
    }

    get minHeight() {
        if (this.stylingAttributes !== null) {
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

    static get LEFT() {
        return 0;
    }

    static get CENTER() {
        return 1;
    }

    static get RIGHT() {
        return 2;
    }

    constructor(x = 0, y = 0, stylingAttributes, groupStylingAttributes = new GroupStylingAttributes()) {
        super(x, y, 1, 1, stylingAttributes);
        this._groupStylingAttributes = groupStylingAttributes;
        this._children = [];
        this._resizePolicy = [];
        this._gravity = [];
        this._frame = null;
        this._dimensionReadjustmentEnabled = true;
        // Does the group must fit its content?
        // If the user resize it, for example, this attribute may be changed to false.
        this._fitContent = true;
    }

    /**
     * Recalculate children position and dimension.
     */
    adjustChildrenPositionAndDimension() {
        let availableWidthForChildren = this.width;
        let newX = this.x;
        let newY = this.y + this.verMargin;
        let rightXLimit = this.x + this.width;
        let bottomYLimit = this.y + this.height;
        if (this.frame !== null) {
            let contentBox = this.frame.contentBox(this.width, this.height);
            availableWidthForChildren = contentBox.width;
            newX = contentBox.x1;
            newY = contentBox.y1 + this.verMargin;
            rightXLimit = contentBox.x2;
            bottomYLimit = contentBox.y2;
        }

        // Center content vertically inside the group.
        // It is important for squared frames as circles, for example.
        let contentHeight = this.verMargin;
        for(let child of this.children) {
            contentHeight += child.height;
            contentHeight += this.verMargin;
        }
        let deltaY = ((bottomYLimit - newY) - contentHeight) / 2;
        if (deltaY > 0) {
            newY += deltaY;
        }

        // Adjust children's position and dimension.
        let i = 0;
        for (i = 0; i < this.countChildren(); i++) {
            let oldChangeNotificationsStatus = this.children[i].changeNotificationsEnabled;
            this.children[i].disableChangeNotifications(); // Prevent cascade readjustments: parent changes child and child changes parent.

            if (this.resizePolicy[i] === VerticalGroup.WRAP_CONTENT) {
                if (this.gravity[i] === VerticalGroup.LEFT) {
                    this.children[i].x = newX + this.horMargin;
                } else if (this.gravity[i] == VerticalGroup.RIGHT) {
                    this.children[i].x = rightXLimit - this.horMargin - this.children[i].width;
                } else {
                    this.children[i].x = ((newX + rightXLimit) / 2) - this.children[i].width / 2;
                }
            } else if (this.resizePolicy[i] === VerticalGroup.FILL_SPACE) {
                this.children[i].width = availableWidthForChildren - 2 * this.horMargin;
                this.children[i].x = newX + this.horMargin;
            } else if (this.resizePolicy[i] === VerticalGroup.MATCH_PARENT) {
                this.children[i].width = availableWidthForChildren;
                this.children[i].x = newX;
            }
            this.children[i].y = newY;
            newY += this.children[i].height + this.verMargin;

            this.children[i].changeNotificationsEnabled = oldChangeNotificationsStatus;
            this.children[i].notifyListeners();
        }
    }

    /**
     * Readjusts the group dimension.
     */
    readjustDimensions() {
        if (!this.dimensionReadjustmentEnabled) {
            return;
        }

        if (this.fitContent || this.minWidth > this.width) {
            this.width = this.minWidth;
        }
        if (this.fitContent || this.minHeight > this.height) {
            this.height = this.minHeight;
        }
    }

    /**
     * Replaces the behaviour of the notifyListeners method.
     * Repasses the notification to the frame and the group children.
     */
    /* notifyListeners() {
     super.notifyListeners();
     if(this.frame !== null) {
     this.frame.notifyListeners();
     }
     for(let child of this.children) {
     child.notifyListeners();
     }
     }*/

    /**
     * Returns the group x coordinate.
     * @returns {number} The group x coordinate.
     */
    get
    x() {
        return super.x;
    }

    /**
     * Sets the group x coordinate.
     * @param {number} value The new x coordinate.
     */
    set
    x(value) {
        // Calculate the difference between the current x value and the new one.
        let delta = value - this.x;

        super.x = value;
        if (this.frame !== null) {
            this.frame.x = this.x;
        }

        //*****************************
        // Move all children.
        this.disableDimensionReadjustment(); // The dimension does not have to change in this case.
        for (let child of this.children) {
            child.x += delta;
        }
        this.enableDimensionReadjustment();
    }

    /**
     * Returns the group y coordinate.
     * @returns {number} The group y coordinate.
     */
    get
    y() {
        return super.y;
    }

    /**
     * Changes the group y coordinate.
     * @param {number} value The new y coordinate.
     */
    set
    y(value) {
        // Calculate the difference between the current y value and the new one.
        let delta = value - this.y;

        super.y = value;
        if (this.frame !== null) {
            this.frame.y = this.y;
        }

        //*****************************
        // Move all children.
        this.disableDimensionReadjustment(); // The dimension does not have to change in this case.
        for (let child of this.children) {
            child.y += delta;
        }
        this.enableDimensionReadjustment();
    }

    /**
     * Returns the group width.
     * @returns {number} The group width.
     */
    get
    width() {
        return super.width;
    }

    /**
     * Sets the group width.
     * If the new width is smaller than the minimum required width to display the group, return without changing anything.
     * @param {number} value The new width.
     */
    set
    width(value) {
        let oldChangeNotificationsStatus = this.changeNotificationsEnabled;
        let oldDimensionReadjustmentStatus = this.dimensionReadjustmentEnabled;
        this.disableChangeNotifications(); // Prevent stack overflow.
        this.disableDimensionReadjustment(); // Prevent stack overflow.
        let minimumRequiredWidth = this.minContentWidth;
        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x + minimumRequiredWidth, this.y2);
            minimumRequiredWidth = this.frame.widthToFit(boundingBox);
        }
        if (value < minimumRequiredWidth) { // Do not resize if the content does not fit the new width.
            return;
        }

        super.width = value;

        // Check whether the height must be changed.
        // It must be necessary if the frame is a circle or a square, for example.
        if (this.frame !== null) {
            this.frame.width = this.width;
            super.height = this.frame.height;
        }

        this.adjustChildrenPositionAndDimension();

        this.changeNotificationsEnabled = oldChangeNotificationsStatus;
        this.dimensionReadjustmentEnabled = oldDimensionReadjustmentStatus;
    }

    /**
     * Increases the width value by the specified parameter value.
     * @param {number} value The width delta.
     */
    increaseWidthBy(value) {
        this.width += value;
    }

    /**
     * Calculates and returns the minimum width required to display the group content.
     * @returns {number} The minimum width required to display the group content.
     */
    get
    minContentWidth() {
        let calcMinWidth = 0;
        // Get the biggest child min width and add the horizontal margin when necessary.
        for (let i = 0; i < this.countChildren(); i++) {
            let child = this.getChildAt(i);
            if (child.minWidth > calcMinWidth) {
                calcMinWidth = child.minWidth;
                // MATCH_PARENT does not use horizontal margins for elements.
                // It is used for lines, for example.
                if (this.resizePolicy[i] !== VerticalGroup.MATCH_PARENT) {
                    calcMinWidth += 2 * this.horMargin;
                }
            }
        }
        return calcMinWidth;
    }

    /**
     * Calculates and returns the minimum width required to display the group frame and its content.
     * @returns {number} The minimum width required to display the group frame and its content.
     */
    get
    minWidth() {
        let calcMinWidth = this.minContentWidth;

        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x + calcMinWidth, this.y2);
            let frameWidth = this.frame.widthToFit(boundingBox);
            return frameWidth;
        }

        return calcMinWidth;
    }

    /**
     * Returns the group height.
     * @returns {number} The group height.
     */
    get
    height() {
        return super.height;
    }

    /**
     * Calculates and returns the minimum height required to display the group frame and its content.
     * @returns {number} The minimum height required to display the group frame and its content.
     */
    get
    minHeight() {
        let calcMinHeight = this.minContentHeight;

        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x2, this.y + calcMinHeight);
            let frameHeight = this.frame.heightToFit(boundingBox);
            return frameHeight;
        }

        return calcMinHeight;
    }

    /**
     * Sets the group height.
     * @param {number} value The group height.
     */
    set
    height(value) {
        let oldChangeNotificationsStatus = this.changeNotificationsEnabled;
        let oldDimensionReadjustmentStatus = this.dimensionReadjustmentEnabled;

        this.disableChangeNotifications();
        this.disableDimensionReadjustment(); // Prevent stack overflow.
        let minimumRequiredHeight = this.minHeight;
        if (value < minimumRequiredHeight) {
            return;
        }

        super.height = value;

        // Check whether the width must be changed.
        // It must be necessary if the frame is a circle or a square, for example.
        if (this.frame !== null) {
            this.frame.height = this.height;
            super.width = this.frame.width;
        }

        this.adjustChildrenPositionAndDimension();

        this.changeNotificationsEnabled = oldChangeNotificationsStatus;
        this.dimensionReadjustmentEnabled = oldDimensionReadjustmentStatus;
    }

    /**
     * Increases the height value by the specified parameter value.
     * @param {number} value The height delta.
     */
    increaseHeightBy(value) {
        this.height += value;
    }

    /**
     * Calculates and returns the minimum height required to display the group content.
     * @returns {number} The minimum height required to display the group content.
     */
    get
    minContentHeight() {
        let contentMinHeight = 0;
        for (let child of this.children) {
            contentMinHeight += this.verMargin;
            contentMinHeight += child.minHeight;
        }
        contentMinHeight += this.verMargin;

        return contentMinHeight;
    }

    /**
     * Returns the children.
     * @returns {Array} The children.
     */
    get
    children() {
        return this._children;
    }

    /**
     * Sets the children.
     * @param {Array} value The children array.
     */
    set
    children(value) {
        this._children = [];
        for (let child of value) {
            this.add(child);
        }
    }

    /**
     * Appends a new child to the group.
     * @param child The child.
     * @param resizePolicy the child resize policy.
     * @param gravity The child horizontal gravity.
     */
    addChild(child, resizePolicy = VerticalGroup.WRAP_CONTENT, gravity = VerticalGroup.LEFT) {
        let oldChangeNotificationsStatus = this.changeNotificationsEnabled;
        let oldDimensionReadjustmentStatus = this.dimensionReadjustmentEnabled;
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
            let boundingBox = new BoundingBox(this.x, this.y, this.x + requiredGroupWidth, this.y2);
            requiredGroupWidth = this.frame.widthToFit(boundingBox);
        }

        //*****************************
        // Add to the group the child, its resizing policy, and its gravity.
        this.children.push(child);
        this.resizePolicy.push(resizePolicy);
        this.gravity.push(gravity);

        //*****************************
        // Update the group width if necessary.
        if (this.width < requiredGroupWidth) {
            this.width = requiredGroupWidth;
        }

        // Add the group as a child change listener.
        child.addChangeListener(new VerticalGroupChildChangeListener(this));

        this.adjustChildrenPositionAndDimension();

        this.changeNotificationsEnabled = oldChangeNotificationsStatus;
        this.dimensionReadjustmentEnabled = oldDimensionReadjustmentStatus;
    }

    /**
     * Returns the number of children.
     * @returns {Number} The number of children.
     */
    countChildren() {
        return this._children.length;
    }

    /**
     * Returns the children at the specified index.
     * @param {number} i The index.
     * @returns {GeometricShape} The child at the specified index.
     */
    getChildAt(i) {
        return this._children[i];
    }

    /**
     * Returns the frame.
     * @returns {GeometricShape|null} The frame.
     */
    get
    frame() {
        return this._frame;
    }

    // TODO: What to do when a frame is removed?
    /**
     * Sets the frame.
     * @param {GeometricShape|null} value value The new frame.
     */
    set
    frame(value) {
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

    get
    dimensionReadjustmentEnabled() {
        return this._dimensionReadjustmentEnabled;
    }

    set
    dimensionReadjustmentEnabled(value) {
        this._dimensionReadjustmentEnabled = value;
    }

    disableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = false;
    }

    enableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = true;
    }

    get
    fitContent() {
        return this._fitContent;
    }

    set
    fitContent(value) {
        this._fitContent = value;
    }

    forceFitContent() {
        this.fitContent = true;
        this.readjustDimensions();
    }

    get
    groupStylingAttributes() {
        return this._groupStylingAttributes;
    }

    set
    groupStylingAttributes(value) {
        this._groupStylingAttributes = value;
        this.notifyListeners();
    }

    /**
     * Returns the horizontal margin.
     * @returns {number} The horizontal margin.
     */
    get
    horMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.horMargin;
        }
        return 0;
    }

    /**
     * Returns the vertical margin.
     * @returns {number} The vertical margin.
     */
    get
    verMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.verMargin;
        }
        return 0;
    }

    get
    borderSize() {
        if (this.frame !== null && this.frame.stylingAttributes !== null) {
            return this.frame.stylingAttributes.strokeWidth / 2;
        }
    }

    get
    resizePolicy() {
        return this._resizePolicy;
    }

    set
    resizePolicy(value) {
        this._resizePolicy = value;
    }

    get
    gravity() {
        return this._gravity;
    }

    set
    gravity(value) {
        this._gravity = value;
    }

}

class VerticalGroupChildChangeListener
    extends ChangeListener {

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
    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
    }

    constructor(family = "'Open Sans', sans-serif", size = 13, weight = "100", style="normal", target = null) {
        this._family = family;
        this._size = size;
        this._weight = weight;
        this._target = target;
        this._style = style;
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