# Understanding WebDiagrams

WebDiagrams was planned based on a simple usage pattern as examplified next.

#### Drawing primitives
```javascript
// Create a new drawing area (may be a SVG, canvas or div).
let drawingArea = new DrawingArea("#area"); // Any valid selector may be used here.
drawingArea.lookAndFeel = LookAndFeel.DEFAULT; // Different look and feel may be implemented.
drawingArea.setViewRegion(0, 0, 500, 500); // For zooming.

// Create a circle and define callbacks for clicking and moving the mouse over the circle.
let circle = drawingArea.circle(50, 10, 10).click(function () {}).move(function () {});

// Move the circle. It updates the drawing area.
circle.move(50, 50);

// Change the circle radius. It updates the drawing area.
circle.radius = 50;
```
#### Drawing diagrams
```javascript
// Create a new diagram area (may be a SVG, canvas or div).
let diagramArea = new DiagramArea("#area"); 
diagramArea.lookAndFeel = LookAndFeel.DEFAULT; // Different look and feel may be implemented.

// Customize callback functions (if necessary).
diagramArea.onClick(function(e) {
  e.preventDefault();
});

// Draw a class diagram on the diagram area.
classDiagram.drawOn(diagramArea);

// Customize callback functions (if necessary).
classDiagram.onNewClass(function(e) {
  e.preventDefault();
});

classDiagram.onNewAttribute(function(e) {
  e.preventDefault();
});
```

Considering these usages, we decided to establish the architecture described next.

## DrawingArea

The drawing area must recognize the type of element selected and instantiate the appropriate drawer (e.g.: a drawer for SVG, for canvas or other). The default drawers uses the default LookAndFeel. We decided to understand each drawer as a strategy (Strategy design pattern) and to create a factory (Factory Design Pattern), called by DrawingArea, to create the appropriate drawer. This factory receives two arguments: the selector and the look and feel. If no drawer is found for the argument combination, an exception is thrown.

When the look and feel changes, this factory is used again to get a new drawer. If primitives are drawn on the drawing area, this drawer must redraw the primitives.

The drawing area has methods to create primitives and it just delegates the feature to the related drawer. When a primitive is created, the drawer returns a primitive metamodel that contains its metadata (e.g. position, dimension etc.). This metamodel is stored in the drawing area and returned to the user to be manipulated. When a primitive is manipulated (e.g. position changed, redimensioned), the drawer updates the drawing. This is done through callbacks defined by drawers to listen changing events on primitives and on the drawing area. When the drawer is draws on a canvas, a new drawing must redraw all primitives. To do that, the drawer must store a reference to the drawing area to get all primitives and draw all of them. If the drawer draws on a svg, this is not necessary since each element can be manipulated individually.

## Graphics Primitives

A graphics primitive may responde to events. An event listener is registered through the primitive metamodel, but its implementation depend on the technology on which the drawer is based. For example, if it is a canvas, the events are registered to the whole canvas. If it is a SVG, each element may have its own events. A drawer always adds handlers for every event to all primitives and call the primitive method when the event happens. The primitive itself may call a callback when the user defines one. A callback may prevent the execution of default events.

## Diagram Area

A diagram area is just a subclass of a drawing area. Depending on the look and feel of the diagram, it instantiates the respective look and feel of the primitive library. A diagram look and feel just maps a name to the respective primitives look and feel.

When a diagram is drawn on the diagram area, it calls a method of the diagram class to get the drawer for that diagram. A diagram has only one drawer. This drawer uses the primitive drawer defined in the diagram area (that is based on a specific look and feel) to draw the diagrams. A diagram drawer attributes to each primitive a reference to the metamodel element it represents. The positioning of nodes in the diagram is defined by a diagram metamodel.

