#
# Renders a marker for the completion notification of a stream diagram.
#
h = require 'hyperscript'
vh = require 'virtual-hyperscript'
Utils = require 'rxmarbles/views/utils'

render = (completionTime) ->
  element = h("div.diagramCompletion.is-draggable.js-completion", {}, [
    h("div.diagramCompletion-inner")
  ])
  element.dataStream = Utils.getInteractiveLeftPosStream(element, completionTime)
  element.dataStream
    .subscribe((leftPos) ->
      element.style.left = leftPos + "%"
      return true
    )
  return element

virtualRender = (completionTime) ->
  return vh("div.diagramCompletion", {style: {"left": completionTime+"%"}}, [
    vh("div.diagramCompletion-inner")
  ])

module.exports = {
  render: render
  virtualRender: virtualRender
}
