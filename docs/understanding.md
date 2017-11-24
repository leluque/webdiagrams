# Understanding WebDiagrams

WebDiagrams was planned based on a simple usage pattern as examplified next.

```
// ********** PRIMITIVES.
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
```
// ********** DIAGRAMS.

// Create a new diagram area (may be a SVG, canvas or div).
let diagramArea = new DiagramArea("#area"); 
diagramArea.lookAndFeel = LookAndFeel.DEFAULT; // Different look and feel may be implemented.

// Customize callback functions (if necessary).
diagramArea.onClick(new function() {
  e.preventDefault();
});

// Draw a class diagram on the diagram area.
classDiagram.drawOn(diagramArea);

// Customize callback functions (if necessary).
classDiagram.onNewClass(new function(e) {
  e.preventDefault();
});
classDiagram.onNewAttribute(new function(e) {
  e.preventDefault();
});
```

Considering these usages, we decided to establish the architecture described next.
