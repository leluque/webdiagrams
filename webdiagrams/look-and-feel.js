/**
 * Created by Leandro Luque on 22/11/2017.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

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
