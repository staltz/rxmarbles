#
# Renders a box representing the Rx operator being applied on the input
# streams.
#
h = require 'hyperscript'

renderLabel = (label) ->
  attrs = if label.length > 20 then {style: {"font-size": "1.5rem"}} else {}
  return h("span.operator-box-label", attrs, label)

module.exports = {
  render: (example) ->
    return h("div.operator-box", [ renderLabel(example.label) ])
}
