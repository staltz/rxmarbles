Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'

#
# Renders a stream meant as an input to the play interaction
#

module.exports = {
  render: (serializedStream) ->
    stream = document.createElement("div")
    stream.className = "stream"
    arrow = document.createElement("div")
    arrow.className = "arrow"
    stream.appendChild(arrow)
    arrowHead = document.createElement("div")
    arrowHead.className = "arrow-head"
    stream.appendChild(arrowHead)
    marbles = document.createElement("div")
    marbles.className = "marbles"
    stream.appendChild(marbles)
    for m in serializedStream
      marbles.appendChild(Marble.render(m))
    return stream
}
