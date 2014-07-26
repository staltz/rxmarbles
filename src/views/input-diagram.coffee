Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'

#
# Renders a stream diagram meant as an input to the sandbox
#

module.exports = {
  render: (diagramData) ->
    diagram = document.createElement("div")
    diagram.className = "diagram"

    arrow = document.createElement("div")
    arrow.className = "arrow"
    diagram.appendChild(arrow)

    arrowHead = document.createElement("div")
    arrowHead.className = "arrow-head"
    diagram.appendChild(arrowHead)

    marblesContainer = document.createElement("div")
    marblesContainer.className = "marbles"
    diagram.appendChild(marblesContainer)
    marbles = (Marble.render(i) for i in diagramData)
    for m in marbles
      marblesContainer.appendChild(m)

    diagram.diagramDataStream = Rx.Observable
      .combineLatest((m.dataStream for m in marbles), (args...) -> args)

    return diagram
}
