#
# Renders a stream diagram meant as an input to the sandbox.
#
Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'

createArrowBodyElement = ->
  arrowBody = document.createElement("div")
  arrowBody.className = "arrow"
  return arrowBody

createArrowHeadElement = ->
  arrowHead = document.createElement("div")
  arrowHead.className = "arrow-head"
  return arrowHead

createMarblesContainerElement = (marbleViews) ->
  marblesContainer = document.createElement("div")
  marblesContainer.className = "marbles"
  for m in marbleViews
    marblesContainer.appendChild(m)
  return marblesContainer

makeDataStream = (marbleViews) ->
  return Rx.Observable.combineLatest(
    (m.dataStream for m in marbleViews), (args...) -> args
  )

module.exports = {
  render: (diagramData) ->
    diagram = document.createElement("div")
    diagram.className = "diagram"
    diagram.appendChild(createArrowBodyElement())
    diagram.appendChild(createArrowHeadElement())
    marbleViews = (Marble.render(i, true) for i in diagramData)
    diagram.appendChild(createMarblesContainerElement(marbleViews))
    diagram.dataStream = makeDataStream(marbleViews)
    return diagram
}
