/*
 * Renders a box representing the Rx operator being applied on the input
 * streams.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');

function vrenderLabel(label) {
  var attrs = (label.length > 20) ? {style: {"font-size": "1.5rem"}} : {};
  return h("span.operator-box-label", attrs, label);
}

function vrender(example) {
  return h("div.operator-box", [vrenderLabel(example.label)]);
}

module.exports = {
  vrender: vrender
};
