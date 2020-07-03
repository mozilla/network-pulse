// keycodes for tab,enter,comma, used with
// the react-tags-autocomplete component
// The delimiters option is now an array of KeyboardEvent.key values and
// not KeyboardEvent.keyCode codes,
// e.g. [13, 9] should now be written as ['Enter', 'Tab']. See https://keycode.info/ for more information.

// It seems like react-tags-autocomplete no longer accepts Comma as delimiter
// GitHub ticket filed: https://github.com/i-like-robots/react-tags/issues/213
const DELIMITERS = [`Tab`, `Enter`];
export { DELIMITERS };
