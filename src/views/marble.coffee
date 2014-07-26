Rx = require 'rx'
XMLNS = "http://www.w3.org/2000/svg"

#
# Renders a circle or similar shape to represent an emitted item on a stream
#

NUM_COLORS = 4

getDxDragStream = (element) ->
  return Rx.Observable.fromEvent(element, "mousedown")
    .map( ->
      moveStream = Rx.Observable.fromEvent(document, "mousemove")
      upStream = Rx.Observable.fromEvent(document, "mouseup")
      dxStream = moveStream
        .map((ev) -> ev.pageX)
        .windowWithCount(2,1)
        .flatMap((result) -> result.toArray())
        .map((array) -> (array[1] - array[0]))
      return dxStream.takeUntil(upStream)
    )
    .concatAll()

module.exports = {
  render: (item) ->
    colornum = (item.id % NUM_COLORS) + 1
    container = document.createElement("div")
    container.className = "marble-container"
    container.leftPos = item.time
    container.style.left = item.time+"%"
    marble = document.createElementNS(XMLNS, "svg")
    marble.setAttributeNS(null, "class", "marble")
    marble.setAttributeNS(null, "viewBox", "0 0 1 1")
    circle = document.createElementNS(XMLNS, "circle")
    circle.setAttributeNS(null, "cx", 0.5)
    circle.setAttributeNS(null, "cy", 0.5)
    circle.setAttributeNS(null, "r", 0.5)
    circle.setAttributeNS(null, "class", "marble marble-color-#{colornum}")
    circle.style["stroke-width"] = "0.07"
    content = document.createElement("p")
    content.className = "marble-content"
    content.textContent = item?.content

    marble.appendChild(circle)
    container.appendChild(marble)
    container.appendChild(content)

    getDxDragStream(container)
      .subscribe((dx) ->
        pxToPercentage = 100.0 / (container.parentElement.clientWidth)
        newPos = container.leftPos + (dx * pxToPercentage)
        newPos = 0 if newPos < 0
        newPos = 100 if newPos > 100
        container.leftPos = newPos
        container.style.left = Math.round(newPos)+"%"
      )
    return container
}
