/**
 * Created by Leandro Luque on 24/07/17.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

/**
 * This class implements a metamodel for UML Class Diagrams.
 */
class UMLClassDiagram {

    constructor(name = "unnamed") {
        this._model = new CElement(name, MODEL);
        this._idCount = 1;
    }

    get name() {
        return this._model.name;
    }

    set name(value) {
        this._model.name = value;
    }

    get idCount() {
        return this._idCount;
    }

    set idCount(value) {
        this._idCount = value;
    }

    addClass(newClass) {
        this._model.addChild(newClass.element);
    }

    getClass(name) {
        return new UMLClass(this._model.getChildByName(name));
    }

    getClasses() {
        return this._model.findChildrenByType(CLASS).map(function (element) {
            return new UMLClass(element);
        });
    }

    addClass(umlClass) {
        this._model.addChild(umlClass.element);
    }

    newClass(name, stereotype, visibility, isAbstract, isLeaf, isStatic) {
        let newClass = UMLClass.newInstance(name, stereotype, visibility, isAbstract, isLeaf, isStatic);
        this._model.addChild(newClass.element);
        return newClass;
    }

    newInterface(name) {
        return this.newClass(name, "interface");
    }

    /**
     * Finds the classes for which the name contains the argument namePart.
     * @param namePart A part of the class name.
     * @returns {Array} An array of UMLClass.
     */
    findClasses(namePart) {
        let elements = this._model.findChildrenByNamePartAndType(namePart, CLASS);
        return elements.map(function (element) {
            return new UMLClass(element);
        });
    }

    /**
     * Finds the interfaces for which the name contains the argument namePart.
     * @param namePart A part of the interface name.
     * @returns {Array} An array of UMLClass.
     */
    findInterfaces(namePart) {
        let elements = this._model.findChildrenByOther(function (child) {
            return (child.name.contains(namePart) && child.type === CLASS && child.isInterface);
        });
        return elements.map(function (element) {
            return new UMLClass(element);
        });
    }

    generateId() {
        return "element_" + (this._idCount++);
    }

    toString() {
        let result = "Class diagram '" + this.name + "'\n";
        result += "==============================\n";
        result += "Classes:\n\n";

        if (this.getClasses()) {
            this.getClasses().forEach(function print(element, index, array) {
                result += element.toString();
                result += "\n\n";
            }, this);
        }
        return result;
    }

}

/**
 * This class implements a metamodel for UML classes.
 */
class UMLClass {

    constructor(element = new CElement("unnamed", CLASS)) {
        this._element = element;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get stereotypes() {
        let stereotypes = this.element.findChildrenByType(STEREOTYPE);
        if (stereotypes === null) {
            return null;
        }
        return stereotypes;
    }

    get isInterface() {
        return this.hasStereotype(INTERFACE);
    }

    static newInstance(name = "unnamed", stereotype, visibility = PUBLIC, isAbstract = false, isLeaf = false, isStatic = false) {
        let newClass = new CElement(name, CLASS);
        if (stereotype !== undefined) {
            newClass.addChild(new VElement(STEREOTYPE, STEREOTYPE, stereotype));
        }
        if (visibility !== undefined) {
            newClass.addChild(new VElement(VISIBILITY, VISIBILITY, visibility));
        }
        if (isAbstract !== undefined) {
            newClass.addChild(new VElement(IS_ABSTRACT, IS_ABSTRACT, isAbstract));
        }
        if (isLeaf !== undefined) {
            newClass.addChild(new VElement(IS_LEAF, IS_LEAF, isLeaf));
        }
        if (isStatic !== undefined) {
            newClass.addChild(new VElement(IS_STATIC, IS_STATIC, isStatic));
        }
        return new UMLClass(newClass);
    }

    addStereotype(stereotype) {
        this.element.addChild(new VElement(stereotype, STEREOTYPE, stereotype));
    }

    countStereotypes() {
        let stereotypes = this.element.findChildrenByType(STEREOTYPE);
        if (!stereotypes.length) {
            return 0;
        } else {
            return stereotypes.length;
        }
    }

    stereotypeAt(index) {
        let stereotypes = this.element.findChildrenByType(STEREOTYPE);
        if (!stereotypes.length) {
            return null;
        } else {
            return stereotypes[index];
        }
    }

    hasStereotype(stereotype) {
        let stereotypes = this.element.findChildrenByType(STEREOTYPE);
        if (!stereotypes.length) {
            return false;
        }
        return (stereotypes.contains(stereotype));
    }

    /**
     * Finds the attributes for which the name contains the argument namePart.
     * @param namePart A part of the attribute name.
     * @returns {Array} An array of UMLClassAttribute.
     */
    findAttributes(namePart) {
        let elements = this.element.findChildrenByNamePartAndType(namePart, ATTRIBUTE);
        return elements.map(function (element) {
            return new UMLClassAttribute(element);
        });
    }

    getAttributeByName(name) {
        return new UMLClassAttribute(this.element.getChildByName(name));
    }

    newAttribute(visibility = PRIVATE, name, type = "String", initialValue, isStatic = false, isReadOnly = false) {
        let attr = UMLClassAttribute.newAttribute(visibility, name, type, initialValue, isStatic, isReadOnly);
        this.element.addChild(attr.element);
        return attr;
    }

    toString() {
        let result = this.element.name;
        if(this.countStereotypes() > 0) {
            for(let i = 0; i < this.countStereotypes(); i++) {
                result += " <<" + this.stereotypeAt(i).value + ">>"
            }
        }
        
        result += "\n";
        
        let attributes = this.element.findChildrenByType(ATTRIBUTE);
        for(let i = 0; i < attributes.length; i++) {
            let visibility = attributes[i].getValue(VISIBILITY);
            let type = attributes[i].getValue(TYPE);
            
            result += visibility + " " + attributes[i].name + ": " + type;
            result += "\n";
        }
        
        // Eliminating the last \n
        return result.substr(0, result.length - 1);
    }

}

class UMLClassAttribute {

    constructor(element = new CElement("unnamed", ATTRIBUTE)) {
        this._element = element;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get visibility() {
        return this.element.getValue(VISIBILITY);
    }

    get type() {
        return this.element.getValue(TYPE);
    }

    get initialValue() {
        return this.element.getValue(INITIAL_VALUE);
    }

    get isStatic() {
        return this.element.getValue(IS_STATIC);
    }

    get isReadOnly() {
        return this.element.getValue(IS_READ_ONLY);
    }

    static newAttribute(visibility = PRIVATE, name = "unnamed", type = "String", initialValue, isStatic = false, isReadOnly = false) {
        let attr = new CElement(name, ATTRIBUTE);
        if (visibility !== null) {
            attr.addChild(new VElement(VISIBILITY, VISIBILITY, visibility));
        }
        if (type !== null) {
            attr.addChild(new VElement(TYPE, TYPE, type));
        }
        if (initialValue !== null) {
            attr.addChild(new VElement(INITIAL_VALUE, INITIAL_VALUE, initialValue));
        }
        if (isStatic !== null) {
            attr.addChild(new VElement(IS_STATIC, IS_STATIC, isStatic));
        }
        if (isReadOnly !== null) {
            attr.addChild(new VElement(IS_READ_ONLY, IS_READ_ONLY, isReadOnly));
        }

        return new UMLClassAttribute(attr);
    }

}

class UMLClassOperation {

    constructor(element = new CElement("unnamed", OPERATION)) {
        this._element = element;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get visibility() {
        return this.element.getValue(VISIBILITY);
    }

    get returnType() {
        return this.element.getValue(RETURN_TYPE);
    }

    get isStatic() {
        return this.element.getValue(IS_STATIC);
    }

    get isLeaf() {
        return this.element.getValue(IS_LEAF);
    }

    static newInstance(visibility = PRIVATE, name = "unnamed", returnType = "void", isStatic = false, isLeaf = false) {
        let operation = new CElement(name, OPERATION);
        if (visibility !== null) {
            operation.addChild(new VElement(VISIBILITY, VISIBILITY, visibility));
        }
        if (returnType !== null) {
            operation.addChild(new VElement(RETURN_TYPE, RETURN_TYPE, returnType));
        }
        if (isStatic !== null) {
            operation.addChild(new VElement(IS_STATIC, IS_STATIC, isStatic));
        }
        if (isLeaf !== null) {
            operation.addChild(new VElement(IS_LEAF, IS_LEAF, isLeaf));
        }

        return new UMLClassOperation(operation);
    }

}
