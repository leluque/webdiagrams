This document presents a quick tour to the WebDiagrams library.

# Purpose

WebDiagrams is a extensible and powerfull client-side Javascript library created to allow the drawing and manipulation of node-and-link diagrams (with super nodes), such as the Unified Modeling Language (UML) diagrams, Entity-Relationship Diagrams (ERD), mental maps, simple graphs, among others.

# Main Design And Usage Requirements

The WebDiagrams library has been developed having in mind some design requirements and usage purposes:
* A **diagram** is not the same as a **model**. The former is just a 'view' of the latter. This way, a UML class model may have different UML class diagrams. As an example, one of the class diagrams may show classes only as a rectangle (hiding attributes and operations) and their relationships. Another class diagram may show details (attributes and operations) for each class. Changes to a model are propagated to all related diagrams. Changes to a diagram may be restrict to the diagram itself (e.g. changes to graphical positioning) or may impact the related model (e.g. model exclusion of a class attribute). The **library must support** both **models** and **diagrams**;
* The library must be **extensible** to any node-and-link model/diagram;
* The library must be compatible with different drawing technologies, such as **SVG** and **canvas**;
* The library must allow **look-and-feel customizations** for any of the drawing technologies;
* As the library has been planned to be used in a multi-user synchronized online Computer-Aided Software Engineering (CASE) tool, it must implement the Observer design pattern in order to inform a server or receive updates from a server when a model changes;

# Structure

Aiming at fulfilling the aforementioned design and usage requirements, the library was organized in layers, as described next.

<pre><code>
┌──────────────────────────────────────────────────────────┐
│                  WebDiagrams Structure                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │          Specific Metamodels and Drawing           │  │
│  │ ┌────────────────────────────────────────────────┐ │  │
│  │ │               UML Class Diagram                │ │  │
|  | | ┌───────────┐ ┌──────────────────────────────┐ | |  |
|  | | | Metamodel | |            Drawer            | | |  |
|  | | └───────────┘ └──────────────────────────────┘ | |  |
│  │ └────────────────────────────────────────────────┘ │  │
|  |                         ...                        |  |
│  └────────────────────────────────────────────────────┘  │
|  ┌───────────────┐ ┌──────────────────────────────────┐  |
|  |               | |  Graphics Primitives Metamodel   |  |
|  |               | └──────────────────────────────────┘  |
|  | Node-And-Link | ┌──────────────────────────────────┐  |
|  |    Generic    | |    Graphics Primitives Drawer    |  |
|  |   Metamodel   | |        ┌───────────────┐         |  |
|  |               | |        | Look and Feel |         |  |
|  |               | |        └───────────────┘         |  |
|  └───────────────┘ └──────────────────────────────────┘  |
└──────────────────────────────────────────────────────────┘
</code></pre>
