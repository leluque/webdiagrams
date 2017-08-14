/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

/**
 * Created by Leandro Luque on 03/07/2017.
 */

'use strict';

function angleBetween2Lines(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    let angle1 = Math.atan2(ay1 - ay2, ax1 - ax2);
    let angle2 = Math.atan2(by1 - by2, bx1 - bx2);
    return toDegrees(Math.abs(angle1) - Math.abs(angle2));
}

/**
 * This method calculates the angle between two vectors with origin at (0, 0).
 * @param ax2 The x-coordinate of the second point (1st vector).
 * @param ay2 The y-coordinate of the second point (1st vector).
 * @param bx2 The x-coordinate of the second point (2nd vector).
 * @param by2 The y-coordinate of the second point (2nd vector).
 * @returns {number} The angle between the two vectors in degrees.
 */
function angleBetween2Vectors(ax2, ay2, bx2, by2) {
    // See http://www.wikihow.com/Find-the-Angle-Between-Two-Vectors

    // Convert y cartesian coordinate to y drawing coordinate.
    ay2 *= -1;
    by2 *= -1;

    // Calculate the length of each vector.
    let lengthV1 = Math.sqrt(ax2*ax2 + ay2*ay2);
    let lengthV2 = Math.sqrt(bx2*bx2 + by2*by2);

    // Calculate the scalar product of the two vectors.
    let scalarProduct = ax2*bx2 + ay2*by2;

    // Calculate the cosine of the angle between the two vectors.
    let cosine = scalarProduct/(lengthV1*lengthV2);

    // Find the angle based on the arccosine.
    let angle = Math.acos(cosine);
    return toDegrees(angle);
}

// Converts from degrees to radians.
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}