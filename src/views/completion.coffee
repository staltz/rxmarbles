#
# Renders a marker for the completion notification of a stream diagram.
#
Utils = require 'rxmarbles/views/utils'

render = (completionTime) ->
  element = document.createElement("div")
  element.className = "completion draggable"
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
