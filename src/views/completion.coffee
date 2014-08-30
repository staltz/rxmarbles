#
# Renders a marker for the completion notification of a stream diagram.
#
h = require 'hyperscript'
Utils = require 'rxmarbles/views/utils'

render = (completionTime) ->
  element = h("div.diagramCompletion.is-draggable", {}, [
    h("div.diagramCompletion-inner")
  ])
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
