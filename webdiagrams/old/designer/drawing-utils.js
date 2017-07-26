"use strict";
/**
 * A class that implements utility methods.
 * @returns {ClassPreferences} New font preferences.
 */
window.webdiagrams = window.webdiagrams || {};
webdiagrams.estimateHeight = function (font, text) {
    // Create a temporary span.
    var tempSpan = document.createElement("span");
    // Draw the specified content with the specified font on the span.
    tempSpan.font = font;
    tempSpan.textContent = text;
    // Add the span to the document and calculate its height.
    document.body.appendChild(tempSpan);
    var height = tempSpan.offsetHeight;
    document.body.removeChild(tempSpan);
    return height;
}
;
