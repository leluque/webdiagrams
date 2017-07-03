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
    return (Math.abs(angle1) - Math.abs(angle2)) * 180 / Math.PI;
}