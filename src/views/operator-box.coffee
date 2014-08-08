#
# Renders a box representing the Rx operator being applied on the input
# streams.
#
h = require 'hyperscript'

module.exports = {
  render: (example) ->
    operatorBoxElement = h("div.operator-box", [
      h("span.operator-box-label", example.label)
    ])
    return operatorBoxElement
}
