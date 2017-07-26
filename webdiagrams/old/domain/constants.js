/**
 * An enumeration of visibility types.
 * @type type The visibility type.
 */
var Visibility = {
    DEFAULT: 1,
    PRIVATE: 2,
    PROTECTED: 3,
    PUBLIC: 4,
    properties: {
        1: {text: ""},
        2: {text: "-"},
        3: {text: "#"},
        4: {text: "+"}
    }
};
/**
 * An enumeration of navigation types.
 * @type type The navigation type.
 */
var Navigation = {
    NON_SPECIFIED: 1,
    NON_NAVIGABLE: 2,
    NAVIGABLE: 3
};