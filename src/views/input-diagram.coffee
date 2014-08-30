#
# Renders a stream diagram meant as an input to the sandbox.
#
h = require 'hyperscript'
Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'
Completion = require 'rxmarbles/views/completion'

createMarblesContainerElement = (diagramData) ->
  marbleViews = (Marble.render(i, true) for i in diagramData)
  children = [Completion.render(diagramData.end)].concat(marbleViews)
  return children

makeDataStream = (diagramElement) ->
  marbleViews = diagramElement.querySelectorAll(".marble-container")
  return Rx.Observable.combineLatest(
    (m.dataStream for m in marbleViews), (args...) -> args
  )

module.exports = {
  render: (diagramData) ->
    diagram = h("div.diagram", {}, [
      h("div.arrow")
      h("div.arrow-head")
      h("div.marbles", {}, createMarblesContainerElement(diagramData))
    ])
    diagram.dataStream = makeDataStream(diagram)
    return diagram
}
