/**
 * Created by Leandro Luque on 24/07/17.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

/**
 * This class implements an element of a general-purpose metamodel.
 */
class Element {

    constructor(name, type) {
        this._name = name;
        this._type = type;
        this._hasChanged = false;
        this._observers = [];
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    // **********************************************************************************
    // * Observer-related operations.
    // **********************************************************************************
    clearChanged() {
        this._hasChanged = false;
    }

    get hasChanged() {
        return this._hasChanged;
    }

    set hasChanged(value) {
        this._hasChanged = value;
    }

    addObserver(observer) {
        if (this._observers.indexOf(observer) < 0) {
            this._observers.push(observer);
            return true;
        }
        return false;
    }

    removeObserver(observer) {
        let position = this._observers.indexOf(observer);
        if (position >= 0 && position < this.countObservers()) {
            this.removeObserverAt(position);
            return true;
        }
        return false;
    }

    countObservers() {
        return this._observers.length;
    }

    notifyObservers() {
        this._observers.forEach(function (e) {
            e.update(null);
        });
    }

    notifyObservers(argument) {
        this._observers.forEach(function (e) {
            e.update(argument);
        });
    }

}

/**
 * This class implements a composite element of a general-purpose metamodel.
 */
class CElement extends Element {

    constructor(name, type) {
        super(name, type);
        // Define a new object to store attributes.
        // It works like a map, but with complexity on search of O(1).
        // The key works as an attribute name.
        this._children = {};
    }

    addChild(child) {
        // If does not exist a child with the same name, add it.
        if (child.name in this._children) {
            this._children[child.name]._values.push(child.value)
            return true;
        }
        this._children[child.name] = child;
        return true;
    }

    countChildren() {
        return Object.keys(this._children).length;
    }

    findChildrenByType(type) {
        let result = [];
        let childrenNames = this.getChildrenNames();
        for (let i = 0; i < childrenNames.length; i++) {
            if (this._children[childrenNames[i]].type === type) {
                result.push(this._children[childrenNames[i]]);
            }
        }
        return result;
    }

    findChildrenByNamePartAndType(namePart, type) {
        let result = [];
        let childrenNames = this.getChildrenNames();
        for (let i = 0; i < childrenNames.length; i++) {
            if (childrenNames[i].contains(namePart) && this._children[childrenNames[i]].type === type) {
                result.push(this._children[childrenNames[i]]);
            }
        }
        return result;
    }

    findChildrenByOther(comparisonFunction) {
        let result = [];
        let childrenNames = this.getChildrenNames();
        for (let i = 0; i < childrenNames.length; i++) {
            if (comparisonFunction(this._children[childrenNames[i]])) {
                result.push(this._children[childrenNames[i]]);
            }
        }
        return result;
    }

    getChildByName(name) {
        return this._children[name];
    }

    getChildrenNames() {
        return Object.keys(this._children);
    }

    removeChild(child) {
        delete this._children[child.name];
    }

    getValue(name) {
        let child = this.getChildByName(name); 
        if(child !== null && child.value !== null) {
            return child.value;
        }
        return null;
    }

}

/**
 * This class implements valuable elements of a general-purpose metamodel.
 */
class VElement extends Element {

    constructor(name, type, value) {
        super(name, type);
        this._values = [];
        if (value !== null) {
            this.addValue(value);
        }
    }

    addValue(value) {
        this._values.push(value);
    }

    removeValue(value) {
        let position = this._values.indexOf(value);
        if (position >= 0 && position < this.countValues()) {
            this.removeValueAt(position);
            return true;
        }
        return false;
    }

    removeValueAt(position) {
        if (position >= 0 && position < this.countValues()) {
            this._values.splice(position, 1);
            return true;
        }
        return false;
    }

    countValues() {
        return this._values.length;
    }

    containsValue(value) {
        return this._values.includes(value);
    }

    getValueAt(position) {
        if (position >= 0 && position < this.countValues()) {
            return this._values[position];
        }
        return null;
    }

    get value() {
        if (this.countValues() > 0) {
            return this._values[0];
        }
    }

    get values() {
        return this._values;
    }

}