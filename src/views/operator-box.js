/*
 * Renders a box representing the Rx operator being applied on the input
 * streams.
 */
var h = require('hyperscript');

function renderLabel(label) {
  var attrs = (label.length > 20) ? {style: {"font-size": "1.5rem"}} : {};
  return h("span.operator-box-label", attrs, label);
};

module.exports = {
  render: function(example) {
    return h("div.operator-box", [renderLabel(example.label)]);
  }
};
