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
    marbles = document.createElement("div")
    marbles.className = "marbles"
    diagram.appendChild(marbles)
    for m in diagramData
      marbles.appendChild(Marble.render(m))
    return diagram
}
