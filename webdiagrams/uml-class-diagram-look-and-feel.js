/**
 * Created by Leandro Luque on 22/11/2017.
 */

/* JSHint configurations */
/* jshint esversion: 6 */
/* jshint -W097 */

'use strict';

let umlClassDiagramLookAndFeelSingleton = null;

/**
 * This class implements a singleton that contains a factory created to return
 * drawers for uml class-related elements based on a specific look and feel.
 * If no look and feel factory is passed as an argument, a default one is adopted.
 */
class UMLClassDiagramLookAndFeel {

    constructor(lookAndFeelFactory = new DefaultUMLClassDiagramLookAndFeelFactory()) {
        if (!umlClassDiagramLookAndFeelSingleton) {
            umlClassDiagramLookAndFeelSingleton = this;

            this._lookAndFeelFactory = lookAndFeelFactory;
        }

        return umlClassDiagramLookAndFeelSingleton;
    }

    get lookAndFeelFactory() {
        return this._lookAndFeelFactory;
    }

    set lookAndFeelFactory(value) {
        this._lookAndFeelFactory = value;
    }

    getDrawerFor(element) {
        return this._lookAndFeelFactory.getDrawerFor(element);
    }

}

/**
 * This class implements a default look and feel factory for UML class diagrams.
 */
class DefaultUMLClassDiagramLookAndFeelFactory {

    getDrawerFor(element) {
        if (element instanceof UMLClass) {
            return new DefaultClassDrawer();
        }
    }

}

class DefaultClassDrawer extends DefaultDrawer {

    draw(element, x, y) {
        let svgArea = this.svgArea;
        rect = svgArea.rect()
        umlClass = svgArea.vgroup(x, y);
        umlClass.frame = rect;

        // Stereotypes.
        for (let i = 0; i < umlClass.countStereotypes(); i++) {
            let stereotype = svgArea.text(undefined, undefined, "<<" + umlClass.stereotypeAt(i) + ">>");
            umlClass.addChild(stereotype, VerticalGroup.WRAP_CONTENT, VerticalGroup.CENTER);
        }

        // Class name.
        umlClass.addChild(svgArea.text(undefined, undefined, umlClass.name), VerticalGroup.WRAP_CONTENT, VerticalGroup.CENTER);
        umlClass.addChild(svgArea.line(), VerticalGroup.MATCH_PARENT);
        umlClass.addChild(svgArea.text(undefined, undefined, "- registry: String"));
        umlClass.addChild(svgArea.text(undefined, undefined, "- name: String"));
        umlClass.addChild(svgArea.text(undefined, undefined, "- birthDate: Date"));
        umlClass.addChild(svgArea.line(), VerticalGroup.MATCH_PARENT);
        umlClass.addChild(svgArea.text(undefined, undefined, "+ save(): void"));
        umlClass.addChild(svgArea.text(undefined, undefined, "+ update(): void"));
        text = svgArea.text(undefined, undefined, "+ findByRegistry(registry: String): List<Customer>");
        umlClass.addChild(text);
    }

}