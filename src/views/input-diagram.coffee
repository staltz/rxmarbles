#
# Renders a stream diagram meant as an input to the sandbox.
#
h = require 'hyperscript'
Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'
Completion = require 'rxmarbles/views/completion'

makeDiagramBodyChildren = (diagramData) ->
  marbleViews = (Marble.render(i, true) for i in diagramData)
  children = [Completion.render(diagramData.end)].concat(marbleViews)
  return children

makeDataStream = (diagramElement) ->
  marbleViews = diagramElement.querySelectorAll(".js-marble")
  completionElement = diagramElement.querySelector(".js-completion")
  dataStream = Rx.Observable
    .combineLatest(
      (m.dataStream for m in marbleViews), (args...) -> args
    )
    .combineLatest(completionElement.dataStream, (marblesData, endTime) ->
      marblesData.end = endTime
      return marblesData
    )
  return dataStream

module.exports = {
  render: (diagramData) ->
    diagram = h("div.diagram", {}, [
      h("div.diagram-arrow")
      h("div.diagram-arrowHead")
      h("div.diagram-body", {}, makeDiagramBodyChildren(diagramData))
    ])
    diagram.dataStream = makeDataStream(diagram)
    return diagram
}
