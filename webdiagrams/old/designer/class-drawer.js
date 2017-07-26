"use strict";
/**
 * A class that knows how to draw classes on a canvas
 * @returns {ClassDrawer} A new class drawer.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.ClassDrawer = function () {
}
;
webdiagrams.ClassDrawer.prototype = {
    constructor: webdiagrams.ClassDrawer,
    draw: function (canvas, drawedClass) {
        var _class = drawedClass.getClass();
        var context = canvas.getContext("2d");
        context.save();
        if (!webdiagrams.generalClassPreferences) {
            webdiagrams.generalClassPreferences = new webdiagrams.GeneralClassPreferences();
            console.log("As no general class preferences were found, a new one was created.");
        }
        if (!webdiagrams.fontPreferences) {
            webdiagrams.fontPreferences = new webdiagrams.FontPreferences();
            console.log("As no font preferences were found, a new one was created.");
        }
        var _font = webdiagrams.fontPreferences.toString();
        var _fontColor = webdiagrams.fontPreferences.getColor();
        var _boldFont = webdiagrams.fontPreferences.toString(true);
        var _italicFont = webdiagrams.fontPreferences.toString(false, true);
        var _preferences = drawedClass.getPreferences();
        var _generalPreferences = webdiagrams.generalClassPreferences;

        // Estimate class regions' width and height.
        context.font = _boldFont;
        var maxWidth = context.measureText(_class.getName()).width;
        context.font = _font;
        // Top region.
        var classNameHeight = webdiagrams.estimateHeight(_boldFont, _class.getName());
        var topRegionHeight = classNameHeight + 2 * _generalPreferences.getVerPad() + (_class.countStereotypes() * _generalPreferences.getVerTextMarg()) + (2 * _generalPreferences.getBorderSize());
        var stereotypesHeight = [];
        var stereotypesText = [];
        for (var i = 0; i < _class.countStereotypes(); i++) {
            stereotypesHeight[i] = webdiagrams.estimateHeight(_font, _class.getStereotype(i));
            topRegionHeight += stereotypesHeight[i];
            stereotypesText[i] = "<<" + _class.getStereotype(i) + ">>";
            var stereotypeWidth = context.measureText(stereotypesText[i]).width;
            if (stereotypeWidth > maxWidth) {
                maxWidth = stereotypeWidth;
            }
        }
        // Fields' region.
        var fieldsRegionHeight = 0;
        var fieldsHeight = [];
        var fieldsText = [];
        for (var i = 0; i < _class.countFields(); i++) {
            fieldsText[i] = _class.getField(i).toString();
            if (_class.getField(i).isAbstract()) {
                fieldsHeight[i] = webdiagrams.estimateHeight(_italicFont, fieldsText[i]);
                context.font = _italicFont;
            }
            else {
                fieldsHeight[i] = webdiagrams.estimateHeight(_font, fieldsText[i]);
            }
            fieldsRegionHeight += fieldsHeight[i];
            var fieldWidth = context.measureText(fieldsText[i]).width;
            if (fieldWidth > maxWidth) {
                maxWidth = fieldWidth;
            }
            if (_class.getField(i).isAbstract()) {
                context.font = _font;
            }
        }
        fieldsRegionHeight += 2 * _generalPreferences.getVerPad() + (_class.countFields() - 1) * _generalPreferences.getVerTextMarg() + (2 * _generalPreferences.getBorderSize());
        // Operations' region.
        var operationRegionHeight = 0;
        var operationsHeight = [];
        var operationsText = [];
        for (var i = 0; i < _class.countOperations(); i++) {
            operationsText[i] = _class.getOperation(i).toString();
            if (_class.getOperation(i).isAbstract()) {
                operationsHeight[i] = webdiagrams.estimateHeight(_italicFont, operationsText[i]);
                context.font = _italicFont;
            }
            else {
                operationsHeight[i] = webdiagrams.estimateHeight(_font, operationsText[i]);
            }
            operationRegionHeight += operationsHeight[i];
            var operationWidth = context.measureText(operationsText[i]).width;
            if (operationWidth > maxWidth) {
                maxWidth = operationWidth;
            }
            if (_class.getOperation(i).isAbstract()) {
                context.font = _font;
            }
        }
        operationRegionHeight += 2 * _generalPreferences.getVerPad() + (_class.countOperations() - 1) * _generalPreferences.getVerTextMarg() + (2 * _generalPreferences.getBorderSize());
        maxWidth += 2 * (_generalPreferences.getHorPad() + _generalPreferences.getBorderSize());

        // Draw the class rectangles.
        var _x = drawedClass.getX();
        var _y = drawedClass.getY();
        context.strokeStyle = _preferences.getBorderColor();
        context.lineWidth = _generalPreferences.getBorderSize();
        context.fillStyle = _preferences.getBackgroundColor();
        // Top.
        context.fillRect(_x, _y, maxWidth, topRegionHeight);
        context.strokeRect(_x, _y, maxWidth, topRegionHeight);
        // Field (middle).
        context.fillRect(_x, _y + topRegionHeight, maxWidth, fieldsRegionHeight);
        context.strokeRect(_x, _y + topRegionHeight, maxWidth, fieldsRegionHeight);
        // Operation (bottom).
        context.fillRect(_x, _y + topRegionHeight + fieldsRegionHeight, maxWidth, operationRegionHeight);
        context.strokeRect(_x, _y + topRegionHeight + fieldsRegionHeight, maxWidth, operationRegionHeight);

        // Draw de class content.
        context.fillStyle = _fontColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        // Top region.
        var currY = _y + _generalPreferences.getBorderSize() + _generalPreferences.getVerPad();
        for (var i = 0; i < _class.countStereotypes(); i++) {
            currY += stereotypesHeight[i] / 2;
            context.fillText(stereotypesText[i], _x + maxWidth / 2, currY);
            currY += stereotypesHeight[i] / 2 + _generalPreferences.getVerTextMarg();
        }
        currY += classNameHeight / 2;
        context.font = _boldFont;
        context.fillText(_class.getName(), _x + maxWidth / 2, currY);
        context.font = _font;
        // Fields' region.
        context.textAlign = "left";
        currY = _y + _generalPreferences.getBorderSize() + topRegionHeight + _generalPreferences.getVerPad();
        for (var i = 0; i < _class.countFields(); i++) {
            currY += fieldsHeight[i] / 2;
            if (_class.getField(i).isAbstract()) {
                context.save();
                context.font = _italicFont;
            }
            context.fillText(fieldsText[i], _x + _generalPreferences.getHorPad(), currY);
            if (_class.getField(i).isAbstract()) {
                context.restore();
            }
            currY += fieldsHeight[i] / 2 + _generalPreferences.getVerTextMarg();
        }
        // Operations' region.
        currY = _y + _generalPreferences.getBorderSize() + topRegionHeight + _generalPreferences.getBorderSize() + fieldsRegionHeight + _generalPreferences.getVerPad();
        for (var i = 0; i < _class.countOperations(); i++) {
            currY += operationsHeight[i] / 2;
            if (_class.getOperation(i).isAbstract()) {
                context.save();
                context.font = _italicFont;
            }
            context.fillText(operationsText[i], _x + _generalPreferences.getHorPad(), currY);
            if (_class.getOperation(i).isAbstract()) {
                context.restore();
            }
            currY += operationsHeight[i] / 2 + _generalPreferences.getVerTextMarg();
        }
        // Save the class boundaries.
        drawedClass.setBoundaries(new webdiagrams.BoundingBox(_x, _y, _x + maxWidth, _y + topRegionHeight + fieldsRegionHeight + operationRegionHeight));
        // Restore the context.
        context.restore();
    }
};