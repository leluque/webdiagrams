/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 08/06/2017.
 */

'use strict';

/**
 * This class implements two dimensional points.
 */
class Point {

    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    /**
     * This method rotates "angle" degrees the point around the specified coordinate.
     * @param centerX The x-coordinate of the rotation center.
     * @param centerY The y-coordinate of the rotation center.
     * @param angle The angle in degrees.
     */
    rotateAround(centerX, centerY, angle) {
        // See https://stackoverflow.com/questions/22491178/how-to-rotate-a-point-around-another-point
        let x1 = this.x - centerX;
        let y1 = this.y - centerY;

        let x2 = x1 * Math.cos(toRadians(angle)) - y1 * Math.sin(toRadians(angle));
        let y2 = x1 * Math.sin(toRadians(angle)) + y1 * Math.cos(toRadians(angle));

        this.x = x2 + centerX;
        this.y = y2 + centerY;
    }

}

/**
 * This class implements a bounding box.
 */
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
        return Math.abs(this.x2 - this.x1);
    }

    get height() {
        return Math.abs(this.y2 - this.y1);
    }

}

/**
 * This class implements a listener for changes in graphical elements.
 */
class ChangeListener {

    update(target) {
        // Update.
    }

}

/**
 * This class implements the default behaviour of graphical elements.
 * It is the base class for all graphical elements.
 */
class GraphicalElement {

    constructor(x = 0, y = 0, width = 0, height = 0, stylingAttributes = new StylingAttributes(), id) {
        this._x = x;
        this._y = y;
        this._minWidth = 1;
        this._width = width;
        this._minHeight = 1;
        this._height = height;
        this._stylingAttributes = stylingAttributes;
        this._stylingAttributes.target = this; // Bidirectional navigation.
        this._id = id;
        this._drawn = null; // A reference to the shape drawn on a drawing area.
        this._changeListeners = []; // A graphical element may have many change listeners.
        this._changeNotificationsEnabled = true; // Must listeners be notified about changes?
        this._rotation = 0; // Rotation angle in degrees.
        this._rotationCenterX = this.x + this.width / 2; // The rotation point x coordinate.
        this._rotationCenterY = this.y + this.height / 2; // The rotation point y coordinate.
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
        this.rotationCenterX = this.x + this.width / 2;
        this.notifyListeners();
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
        this.rotationCenterY = this.y + this.height / 2;
        this.notifyListeners();
    }

    get width() {
        return this._width;
    }

    set width(value) {
        if (value >= this.minWidth) {
            this._width = value;
            this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
            this.rotationCenterX = this.x + this.width / 2;
            this.enableChangeNotifications();
            this.notifyListeners();
        }
    }

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(value) {
        this._minWidth = value;
        if (this.width < this.minWidth) {
            this.width = this.minWidth; // If the width changes, listeners will be notified.
        }
    }

    get height() {
        return this._height;
    }

    set height(value) {
        if (value >= this.minHeight) {
            this._height = value;
            this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
            this.rotationCenterY = this.y + this.height / 2;
            this.enableChangeNotifications();
            this.notifyListeners();
        }
    }

    get minHeight() {
        return this._minHeight;
    }

    set minHeight(value) {
        this._minHeight = value;
        if (this.height < this.minHeight) {
            this.height = this.minHeight; // If the height changes, listeners will be notified.
        }
    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        this._rotation = value;
        this.notifyListeners();
    }

    get rotationCenterX() {
        return this._rotationCenterX;
    }

    set rotationCenterX(value) {
        this._rotationCenterX = value;
        this.notifyListeners();
    }

    get rotationCenterY() {
        return this._rotationCenterY;
    }

    set rotationCenterY(value) {
        this._rotationCenterY = value;
        this.notifyListeners();
    }

    get x2() {
        return this.x + this.width;
    }

    set x2(value) {
        if (value < this.x) {
            // Invert x1 and x2.
            let temp = this.x;
            this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
            this.x = value;
            this.enableChangeNotifications();
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
            this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
            this.y = value;
            this.enableChangeNotifications();
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

    get borderSize() {
        if (this.stylingAttributes !== null) {
            return this.stylingAttributes.strokeWidth / 2;
        }
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

    get changeListeners() {
        return this._changeListeners;
    }

    set changeListeners(value) {
        this._changeListeners = value;
    }

    disableChangeNotifications() {
        this.changeNotificationsEnabled = false;
    }

    enableChangeNotifications() {
        this.changeNotificationsEnabled = true;
    }

    /**
     * Returns the minimum value of X that stays inside the geometric shape for
     * the specified y value.
     * @param givenY The y value.
     */
    boundaryX1For(givenY) {
        return this.x; // Assume, by default, a rectangular shape.
    }

    /**
     * Returns the maximum value of X that stays inside the geometric shape for
     * the specified y value.
     * @param givenY The y value.
     */
    boundaryX2For(givenY) {
        return this.x2; // Assume, by default, a rectangular shape.
    }

    moveTo(newX, newY) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        this.x = newX;
        this.enableChangeNotifications();
        this.y = newY;
    }

    resize(newWidth, newHeight) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        this.width = newWidth;
        this.enableChangeNotifications();
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

/**
 * This class implements circles.
 * The general circle equation is (x-a)^2 + (y-b)^2 = r^2,
 * where
 * a,b are the x,y coordinates of the circle's center.
 */
class Circle
    extends GraphicalElement {

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

    boundaryX1For(givenY) {
        // The circle equation is (x-a)^2 + (y-b)^2 = r^2
        // (x-a)^2 = r^2 - (y-b)^2
        // x^2 - 2xa + a^2 = r^2 - (y-b)^2
        // x^2 - 2xa + (a^2 -r^2 + (y-b)^2) = 0
        let eqa = 1;
        let eqb = -2 * this.centerX;
        let eqc = Math.pow(this.centerX, 2) - Math.pow(this.radius, 2) + Math.pow(givenY - this.centerY, 2);
        let delta = eqb * eqb - 4 * eqa * eqc;
        let sqrtDelta = Math.sqrt(delta);
        let x1 = (-eqb - sqrtDelta) / (2 * eqa);
        return x1;
    }

    boundaryX2For(givenY) {
        let eqa = 1;
        let eqb = -2 * this.centerX;
        let eqc = Math.pow(this.centerX, 2) - Math.pow(this.radius, 2) + Math.pow(givenY - this.centerY, 2);
        let delta = eqb * eqb - 4 * eqa * eqc;
        let sqrtDelta = Math.sqrt(delta);
        let x2 = (-eqb + sqrtDelta) / (2 * eqa);
        return x2;
    }

    contentBox(width = 1, height = 1) {
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

/**
 * This class implements ellipses.
 * The general ellipse equation is (x-h)^2/a^2 + (y-k)^2/b^2 = 1,
 * where
 * a is the radius along the x-axis
 * b is the radius along the y-axis
 * h,k are the x,y coordinates of the ellipse's center.
 */
class Ellipse extends GraphicalElement {

    constructor(centerX = 0, centerY = 0, radiusX = 50, radiusY = 25, stylingAttributes) {
        super(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2, stylingAttributes);
    }

    get width() {
        return super.width;
    }

    set width(value) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        super.width = value;
        this.enableChangeNotifications();
        super.height = value / 2; // Keep the proportion.
    }

    get height() {
        return super.height;
    }

    set height(value) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        super.height = value;
        this.enableChangeNotifications();
        super.width = value * 2; // Keep the proportion.
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

    boundaryX1For(givenY) {
        // The general ellipse equation is (x-h)^2/a^2 + (y-k)^2/b^2 = 1
        // (x^2 - 2xh + h^2)
        // ----------------- + (y-k)^2/b^2 - 1 = 0
        //        a^2
        // (1/a^2)x^2 - (2h/a^2)x + h^2/a^2 + (y-k)^2/b^2 - 1 = 0
        let a = this.radiusX;
        let b = this.radiusY;
        let h = this.centerX;
        let k = this.centerY;
        let eqa = 1 / (a * a);
        let eqb = -2 * h / (a * a);
        let eqc = ((h * h) / (a * a)) + Math.pow(givenY - k, 2) / (b * b) - 1;
        let delta = eqb * eqb - 4 * eqa * eqc;
        let sqrtDelta = Math.sqrt(delta);
        let x1 = (-eqb - sqrtDelta) / (2 * eqa);
        return x1;
    }

    boundaryX2For(givenY) {
        // The general ellipse equation is (x-h)^2/a^2 + (y-k)^2/b^2 = 1
        // (x^2 - 2xh + h^2)
        // ----------------- + (y-k)^2/b^2 - 1 = 0
        //        a^2
        // (1/a^2)x^2 - (2h/a^2)x + h^2/a^2 + (y-k)^2/b^2 - 1 = 0
        let a = this.radiusX;
        let b = this.radiusY;
        let h = this.centerX;
        let k = this.centerY;
        let eqa = 1 / (a * a);
        let eqb = -2 * h / (a * a);
        let eqc = ((h * h) / (a * a)) + Math.pow(givenY - k, 2) / (b * b) - 1;
        let delta = eqb * eqb - 4 * eqa * eqc;
        let sqrtDelta = Math.sqrt(delta);
        let x2 = (-eqb + sqrtDelta) / (2 * eqa);
        return x2;
    }

    contentBox(width = 1, height = 1) {
        let sqrt2 = Math.sqrt(2);
        let rectHeight = (this.height / 2) * sqrt2;
        let rectWidth = (this.width / 2) * sqrt2;
        let deltaX = (this.width - rectWidth) / 2;
        let deltaY = (this.height - rectHeight) / 2;

        let contentBox = new BoundingBox(this.x + deltaX, this.y + deltaY, this.x + this.width - deltaX, this.y + this.height - deltaY);

        return contentBox;
    }

    widthToFit(boundingBox) {
        // Ellipse formula is (x/A)^2+(y/B)^2=1, where A and B are the two radius of the ellipse
        // Rectangle sides are Rw and Rh
        // Let's assume we want ellipse with same proportions as rectangle; then, if we image square in circle (A=B,Rq=Rh) and squeeze it, we well keep ratio of ellipse A/B same as ratio of rectangle sides Rw/Rh;
        // This leads us to following system of equations:
        //     (x/A)^2+(y/B)^2=1
        // A/B=Rw/Rh
        //
        // Lets solve it: A=B*(Rw/Rh)
        //     (Rh/2B)^2+(Rh/2B)^2=1
        // Rh=sqrt(2)*B
        //
        // And final solution:
        //     A=Rw/sqrt(2)
        // B=Rh/sqrt(2)

        return 2 * boundingBox.width / Math.sqrt(2);
    }

    heightToFit(boundingBox) {
        return 2 * boundingBox.height / Math.sqrt(2);
    }

}

/**
 * This class implements rectangles.
 */
class Rectangle extends GraphicalElement {

    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
    }

    contentBox(width, height) { // For rectangles, it does not matter the current width/height of a group they may be a frame of.
        let border = this.borderSize;
        let boundingBox = new BoundingBox(this.x + border, this.y + border, this.x + this.width - border, this.y + this.height - border);
        return boundingBox;
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

/**
 * This class implements diamonds.
 */
class Diamond extends GraphicalElement {

    constructor(x1 = 0, y1 = 0, width = 0, height = 0, preserveAspectRatio = false, stylingAttributes) {
        // The third parameter is the horizontal diagonal and the fourth one is the vertical diagonal.
        super(x1, y1, Math.sqrt(2 * Math.pow(width, 2)), Math.sqrt(2 * Math.pow(height, 2)), stylingAttributes);
        this._preserveAspectRatio = preserveAspectRatio;
    }

    get width() {
        return super.width;
    }

    set width(value) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        super.width = value;
        if (this.preserveAspectRatio) {
            super.height = value;
        }
        this.enableChangeNotifications();
        this.notifyListeners();
    }

    get height() {
        return super.height;
    }

    set height(value) {
        this.disableChangeNotifications(); // Avoid unnecessary repeated notifications.
        super.height = value;
        if (this.preserveAspectRatio) {
            super.width = value;
        }
        this.enableChangeNotifications();
        this.notifyListeners();
    }

    get preserveAspectRatio() {
        return this._preserveAspectRatio;
    }

    set preserveAspectRatio(value) {
        this._preserveAspectRatio = value;
    }

    boundaryX1For(givenY) {
        // Using the line equation for two points:
        // y - y1 = (y2 - y1)/(x2 - x1) * (x - x1)
        // assuming that a = (y2 - y1)/(x2 - x1)
        // x = x1 + (y - y1)/a;
        let middleY = this.y + this.height / 2;
        //let middleX = this.x + this.width / 2;
        let a = this.height / this.width;
        if (givenY === middleY) { // Middle.
            return this.x;
        } else if (givenY < middleY) { // Use the top "/" line.
            return this.x + (givenY - this.y) / a;
        } else { // Use the bottom "\" line.
            return this.x + (givenY - middleY) / a;
        }
    }

    boundaryX2For(givenY) {
        // Using the line equation for two points:
        // y - y1 = (y2 - y1)/(x2 - x1) * (x - x1)
        // assuming that a = (y2 - y1)/(x2 - x1)
        // x = x1 + (y - y1)/a;
        let middleY = this.y + this.height / 2;
        let middleX = this.x + this.width / 2;
        let a = this.height / this.width;
        if (givenY == middleY) { // Middle.
            return this.x + this.width;
        } else if (givenY < middleY) { // Use the top "\" line.
            return middleX + (givenY - this.y) / a;
        } else { // Use the bottom "/" line.
            return middleX + (givenY - middleY) / a;
        }
    }

    contentBox(width, height) { // For diamonds, it does not matter the current width/height of a group they may be a frame of.
        let deltaX = this.width / 4;
        let deltaY = this.height / 4
        let boundingBox = new BoundingBox(this.x + deltaX, this.y + deltaY, this.x + this.width - deltaX, this.y + this.height - deltaY);
        return boundingBox;
    }

    widthToFit(boundingBox) {
        return 2 * boundingBox.width;
    }

    heightToFit(boundingBox) {
        return 2 * boundingBox.height;
    }
}

/**
 * This class implements texts.
 */
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

    get fontStylingAttributes() {
        return this._fontStylingAttributes;
    }

    set fontStylingAttributes(value) {
        this._fontStylingAttributes = value;
        this.fontStylingAttributes.target = this;
        this.notifyListeners();
    }

    calculateDimensions() {
        try {
            this.width = this.minWidth;
            this.height = this.minHeight;
        }
        catch (error) {
        }
    }


}

class Line extends GraphicalElement {

    constructor(x1 = 10, y1 = 10, x2 = 1, y2 = 1, stylingAttributes = new StylingAttributes(1)) {
        super(x1, y1, x2 - x1 + stylingAttributes.strokeWidth, y2 - y1 + stylingAttributes.strokeWidth, stylingAttributes);
        // (+1) was used because the line has at least one pixel even if their initial and final coordinate are equal.
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

class Image extends GraphicalElement {

    constructor(x = 10, y = 10, width = 20, height = 20, image, stylingAttributes) {
        super(x, y, width, height, stylingAttributes);
        this._image = image;
        this._boundingBoxFunction = this.defaultBoundingBox;
        this._widthToFitFunction = this.defaultWidthToFit;
        this._heightToFitFunction = this.defaultHeightToFit;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get boundingBoxFunction() {
        return this._boundingBoxFunction;
    }

    set boundingBoxFunction(value) {
        this._boundingBoxFunction = value;
    }

    get widthToFitFunction() {
        return this._widthToFitFunction;
    }

    set widthToFitFunction(value) {
        this._widthToFitFunction = value;
    }

    get heightToFitFunction() {
        return this._heightToFitFunction;
    }

    set heightToFitFunction(value) {
        this._heightToFitFunction = value;
    }

    defaultBoundingBox(width, height) {
        return new BoundingBox(this.x, this.y, this.x2, this.y2);
    }

    defaultWidthToFit(boundingBox) {
        return boundingBox.width;
    }

    defaultHeightToFit(boundingBox) {
        return boundingBox.height;
    }

    contentBox(width, height) {
        return this.boundingBoxFunction(width, height);
    }

    widthToFit(boundingBox) {
        return this.widthToFitFunction(boundingBox);
    }

    heightToFit(boundingBox) {
        return this.heightToFitFunction(boundingBox);
    }

}

class VerticalGroup extends GraphicalElement {

    constructor(x = 0, y = 0, stylingAttributes, groupStylingAttributes = new GroupStylingAttributes()) {
        super(x, y, 0, 0, stylingAttributes);
        this._groupStylingAttributes = groupStylingAttributes;
        this._children = [];
        this._resizePolicy = [];
        this._gravity = [];
        this._weight = [];
        this._overlap = [];
        this._frame = null;
        this._dimensionReadjustmentEnabled = true;
        // Does the group must fit its content?
        // If the user resize it, for example, this attribute may be changed to false.
        this._fitContent = true;
    }

    // It goes further the content area and touches the frame borders.
    static get MATCH_PARENT() {
        return 3;
    }

    // It does not use horizontal margins for elements.
    static get MATCH_CONTENT_AREA() {
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

    /**
     * Returns the group x coordinate.
     * @returns {number} The group x coordinate.
     */
    get x() {
        return super.x;
    }

    /**
     * Sets the group x coordinate.
     * @param {number} value The new x coordinate.
     */
    set x(value) {
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
    get y() {
        return super.y;
    }

    /**
     * Changes the group y coordinate.
     * @param {number} value The new y coordinate.
     */
    set y(value) {
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
    get width() {
        return super.width;
    }

    /**
     * Sets the group width.
     * If the new width is smaller than the minimum required width to display the group, return without changing anything.
     * @param {number} value The new width.
     */
    set width(value) {
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
     * Calculates and returns the minimum width required to display the group content.
     * @returns {number} The minimum width required to display the group content.
     */
    get minContentWidth() {
        let calcMinWidth = 0;
        // Get the biggest child min width and add the horizontal margin when necessary.
        for (let i = 0; i < this.countChildren(); i++) {
            let child = this.getChildAt(i);
            if (child.minWidth > calcMinWidth) {
                calcMinWidth = child.minWidth;
                // MATCH_CONTENT_AREA does not use horizontal margins for elements.
                // It is used for lines, for example.
                if (this.resizePolicy[i] !== VerticalGroup.MATCH_CONTENT_AREA &&
                    this.resizePolicy[i] !== VerticalGroup.MATCH_PARENT) {
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
    get minWidth() {
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
    get height() {
        return super.height;
    }

    /**
     * Sets the group height.
     * @param {number} value The group height.
     */
    set height(value) {
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
     * Calculates and returns the minimum height required to display the group content.
     * @returns {number} The minimum height required to display the group content.
     */
    get minContentHeight() {
        let contentMinHeight = 0;
        let i = 0;
        for (let child of this.children) {
            contentMinHeight += this.verMargin;
            contentMinHeight += child.minHeight + this.overlap[i];
            i++;
        }
        if (this.countChildren() > 0) {
            contentMinHeight += this.verMargin;
        }

        return contentMinHeight;
    }

    /**
     * Calculates and returns the minimum height required to display the group frame and its content.
     * @returns {number} The minimum height required to display the group frame and its content.
     */
    get minHeight() {
        let calcMinHeight = this.minContentHeight;

        if (this.frame !== null) {
            let boundingBox = new BoundingBox(this.x, this.y, this.x2, this.y + calcMinHeight);
            let frameHeight = this.frame.heightToFit(boundingBox);
            return frameHeight;
        }

        return calcMinHeight;
    }

    /**
     * Returns the children.
     * @returns {Array} The children.
     */
    get children() {
        return this._children;
    }

    /**
     * Sets the children.
     * @param {Array} value The children array.
     */
    set children(value) {
        this._children = [];
        for (let child of value) {
            this.add(child);
        }
    }

    /**
     * Returns the frame.
     * @returns {GeometricShape|null} The frame.
     */
    get frame() {
        return this._frame;
    }

    // TODO: What to do when a frame is removed?
    /**
     * Sets the frame.
     * @param {GeometricShape|null} value value The new frame.
     */
    set frame(value) {
        this.disableChangeNotifications();

        // Change the group width and height to accommodate the frame border.
        this.width += value.borderSize * 2;
        this.height += value.borderSize * 2;

        this._frame = value;
        this.drawn.appendChild(this.frame.drawn);
        this.frame.x = this.x;
        this.frame.y = this.y;
        this.frame.width = this.width;
        this.frame.height = this.height;

        this.adjustChildrenPositionAndDimension();
        this.enableChangeNotifications();

        this.frame.notifyListeners();
        this.notifyListeners();
    }

    get dimensionReadjustmentEnabled() {
        return this._dimensionReadjustmentEnabled;
    }

    set dimensionReadjustmentEnabled(value) {
        this._dimensionReadjustmentEnabled = value;
    }

    get fitContent() {
        return this._fitContent;
    }

    set fitContent(value) {
        this._fitContent = value;
    }

    get groupStylingAttributes() {
        return this._groupStylingAttributes;
    }

    set groupStylingAttributes(value) {
        this._groupStylingAttributes = value;
        this.notifyListeners();
    }

    /**
     * Returns the horizontal margin.
     * @returns {number} The horizontal margin.
     */
    get horMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.horMargin;
        }
        return 0;
    }

    /**
     * Returns the vertical margin.
     * @returns {number} The vertical margin.
     */
    get verMargin() {
        if (this.groupStylingAttributes !== null) {
            return this.groupStylingAttributes.verMargin;
        }
        return 0;
    }

    get borderSize() {
        if (this.frame !== null) {
            return this.frame.borderSize;
        }
    }

    get resizePolicy() {
        return this._resizePolicy;
    }

    set resizePolicy(value) {
        this._resizePolicy = value;
    }

    get gravity() {
        return this._gravity;
    }

    set gravity(value) {
        this._gravity = value;
    }

    get weight() {
        return this._weight;
    }

    set weight(value) {
        this._weight = value;
    }

    get overlap() {
        return this._overlap;
    }

    set overlap(value) {
        this._overlap = value;
    }

    /**
     * Recalculate children position and dimension.
     */
    adjustChildrenPositionAndDimension() {
        let availableWidthForChildren = this.width;
        let newX = this.x;
        let newY = this.y;
        let rightXLimit = this.x + this.width;
        let bottomYLimit = this.y + this.height;
        if (this.frame !== null) {
            let contentBox = this.frame.contentBox(this.width, this.height);
            availableWidthForChildren = contentBox.width;
            newX = contentBox.x1;
            newY = contentBox.y1;
            rightXLimit = contentBox.x2;
            bottomYLimit = contentBox.y2;
        }

        // Calculate the content height.
        let contentHeight = 0;
        if (this.countChildren() > 0) {
            contentHeight += this.verMargin;
        }
        let i = 0;
        for (let child of this.children) {
            contentHeight += child.height + this.overlap[i];
            contentHeight += this.verMargin;
            i++;
        }

        // Calculate the space left after drawing all children.
        let heightLeft = (bottomYLimit - newY) - contentHeight;
        // If the is space left, distribute it among the children with weight greater than zero (0).
        if (heightLeft > 0) {
            // Sum all children weight.
            let weightSum = 0;
            for (i = 0; i < this.countChildren(); i++) {
                weightSum += this.weight[i];
            }
            for (i = 0; i < this.countChildren(); i++) {
                let child = this.children[i];
                if (this.weight[i] > 0) {
                    let deltaHeight = this.weight[i] / weightSum * heightLeft;
                    child.height += deltaHeight;
                }
            }
        }

        // Center content vertically inside the group.
        // It is important for squared frames as circles, for example.
        // Recalculate the content weight.
        contentHeight = 0;
        if (this.countChildren() > 0) {
            contentHeight += this.verMargin;
        }
        i = 0;
        for (let child of this.children) {
            contentHeight += child.height + this.overlap[i];
            contentHeight += this.verMargin;
            i++;
        }
        let deltaY = ((bottomYLimit - newY) - contentHeight) / 2;
        newY += deltaY + this.verMargin; // The vertical margin is necessary to start at the right position for the first child.

        // Adjust children's position and dimension.
        for (i = 0; i < this.countChildren(); i++) {
            let oldChangeNotificationsStatus = this.children[i].changeNotificationsEnabled;
            this.children[i].disableChangeNotifications(); // Prevent cascade readjustments: parent changes child and child changes parent.

            if (this.resizePolicy[i] === VerticalGroup.WRAP_CONTENT) {
                if (this.gravity[i] === VerticalGroup.LEFT) {
                    this.children[i].x = newX + this.horMargin;
                } else if (this.gravity[i] == VerticalGroup.RIGHT) {
                    this.children[i].x = rightXLimit - this.horMargin - this.children[i].width;
                } else {
                    this.children[i].x = ((newX + rightXLimit) - this.children[i].width) / 2;
                }
            } else if (this.resizePolicy[i] === VerticalGroup.FILL_SPACE) {
                this.children[i].width = availableWidthForChildren - 2 * this.horMargin;
                this.children[i].x = newX + this.horMargin;
            } else if (this.resizePolicy[i] === VerticalGroup.MATCH_CONTENT_AREA) {
                this.children[i].width = availableWidthForChildren;
                this.children[i].x = newX;
            } else if (this.resizePolicy[i] === VerticalGroup.MATCH_PARENT) {
                let boundaryX1 = this.boundaryX1For(newY);
                let boundaryX2 = this.boundaryX2For(newY);
                if (this.frame !== null) {
                    boundaryX1 = this.frame.boundaryX1For(newY);
                    boundaryX2 = this.frame.boundaryX2For(newY);
                }

                this.children[i].width = boundaryX2 - boundaryX1;
                this.children[i].x = boundaryX1;
            }

            newY += this.overlap[i];
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
     * Increases the width value by the specified parameter value.
     * @param {number} value The width delta.
     */
    increaseWidthBy(value) {
        this.width += value;
    }

    /**
     * Increases the height value by the specified parameter value.
     * @param {number} value The height delta.
     */
    increaseHeightBy(value) {
        this.height += value;
    }

    /**
     * Appends a new child to the group.
     * @param child The child.
     * @param resizePolicy the child resize policy.
     * @param gravity The child horizontal gravity.
     */
    addChild(child, resizePolicy = VerticalGroup.WRAP_CONTENT, gravity = VerticalGroup.LEFT, weight = 0, overlap = 0) {
        let oldChangeNotificationsStatus = this.changeNotificationsEnabled;
        let oldDimensionReadjustmentStatus = this.dimensionReadjustmentEnabled;
        this.disableChangeNotifications(); // Avoid unnecessary change notifications.
        this.disableDimensionReadjustment(); // Avoid unnecessary readjustments.

        //*****************************
        // Increase the group height to fit the new child.
        let childRequiredHeight = child.height + this.verMargin + overlap;
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
        this.weight.push(weight);
        this.overlap.push(overlap);
        this.drawn.appendChild(child.drawn);

        //*****************************
        // Update the group width if necessary.
        if (this.width < requiredGroupWidth) {
            this.width = requiredGroupWidth;
        }

        // Add the group as a child change listener.
        child.addChangeListener(new VerticalGroupChildChangeListener(this));

        this.changeNotificationsEnabled = oldChangeNotificationsStatus;
        this.adjustChildrenPositionAndDimension();
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

    disableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = false;
    }

    enableDimensionReadjustment() {
        this._dimensionReadjustmentEnabled = true;
    }

    forceFitContent() {
        this.fitContent = true;
        this.readjustDimensions();
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

class LinearGroup extends GraphicalElement {

    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, stylingAttributes) {
        super(x1, y1, x2 - x1, y2 - y1, stylingAttributes);
        this._verticalGroup = new VerticalGroup(x1, y1, stylingAttributes, new GroupStylingAttributes(0, 0));
    }

    get verticalGroup() {
        return this._verticalGroup;
    }

    set verticalGroup(value) {
        this._verticalGroup = value;
    }

    addChild(child, weight = 0, overlap = 0) {
        this.verticalGroup.addChild(child, VerticalGroup.WRAP_CONTENT, VerticalGroup.CENTER, weight, overlap);
        this.recalculate();
    }

    recalculate() {
        let lineHeight = 1 + Math.abs(Math.abs(this.verticalGroup.height - Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2))));
        this.verticalGroup.increaseHeightBy(lineHeight);

        let groupX = Math.min(this.x1, this.x2) + this.width / 2 - this.verticalGroup.width / 2;
        let groupY = Math.min(this.y1, this.y2) - (this.verticalGroup.height - this.height) / 2;
        this.verticalGroup.x = groupX;
        this.verticalGroup.y = groupY;

        let middleX = this.verticalGroup.x + this.verticalGroup.width / 2;
        let angle = angleBetween2Lines(middleX, this.verticalGroup.y, middleX, this.verticalGroup.y + this.verticalGroup.height,
            this.x, this.y, this.x, this.y2);
        this.verticalGroup.rotation = -1 * angle;
    }
}

class StylingAttributes {

    constructor(strokeWidth = 3, strokeColor = 'black', fillColor = '#FFFFCC', strokeDashArray = null, target = null) {
        this._strokeWidth = strokeWidth;
        this._strokeColor = strokeColor;
        this._fillColor = fillColor;
        this._target = target;
        this._strokeDashArray = strokeDashArray;

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

    get strokeDashArray() {
        return this._strokeDashArray;
    }

    set strokeDashArray(value) {
        this._strokeDashArray = value;
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
        if (this.strokeDashArray !== null) {
            style += " stroke-dasharray: " + this.strokeDashArray + ";"
        }
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
    constructor(family = "'Roboto', sans-serif", size = 13, weight = "100", style = "normal", target = null) {
        this._family = family;
        this._size = size;
        this._weight = weight;
        this._target = target;
        this._style = style;
    }

    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
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