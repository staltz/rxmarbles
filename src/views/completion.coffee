#
# Renders a marker for the completion notification of a stream diagram.
#
h = require 'hyperscript'
Utils = require 'rxmarbles/views/utils'

render = (completionTime) ->
  element = h("div.completion.draggable", {}, [ h("div.completion-marker") ])
  element.dataStream = Utils.getInteractiveLeftPosStream(element, completionTime)
  element.dataStream
    .subscribe((leftPos) ->
      element.style.left = leftPos + "%"
      return true
    )
  return element

module.exports = {
  render: render
}
