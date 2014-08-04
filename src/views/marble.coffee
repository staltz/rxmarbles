#
# Renders a circle or similar shape to represent an emitted item on a stream
#
Rx = require 'rx'
h = require 'virtual-hyperscript'
svg = require 'virtual-hyperscript/svg'

XMLNS = "http://www.w3.org/2000/svg"
NUM_COLORS = 4
SVG_VIEWBOX = "0 0 1 1"
SVG_CX = 0.5
SVG_CY = 0.5
SVG_R = 0.47
SVG_BORDER_WIDTH = "0.07px"

getDxDragStream = (element) ->
  return Rx.Observable.fromEvent(element, "mousedown")
    .map( ->
      moveStream = Rx.Observable.fromEvent(document, "mousemove")
      upStream = Rx.Observable.fromEvent(document, "mouseup")
      dxStream = moveStream
        .map((ev) ->
          ev.stopPropagation
          ev.preventDefault()
          return ev.pageX
        )
        .windowWithCount(2,1)
        .flatMap((result) -> result.toArray())
        .map((array) -> (array[1] - array[0]))
      return dxStream.takeUntil(upStream)
    )
    .concatAll()

getInteractiveLeftPosStream = (element, initialPos) ->
  return getDxDragStream(element)
    .scan(initialPos, (acc, dx) ->
      pxToPercentage = 1
      try
        pxToPercentage = 100.0 / (element.parentElement.clientWidth)
      catch err
        console.warn(err)
      return acc + (dx * pxToPercentage)
    )
    .map((pos) ->
      return 0 if pos < 0
      return 100 if pos > 100
      return pos
    )
    .map(Math.round)
    .startWith(initialPos)
    .distinctUntilChanged()

createRootElement = (draggable) ->
  container = document.createElement("div")
  container.className = "marble-container"
  if draggable
    container.className += " draggable"
  return container

createMarbleSvg = (item) ->
  colornum = (item.id % NUM_COLORS) + 1
  marble = document.createElementNS(XMLNS, "svg")
  marble.setAttribute("class", "marble")
  marble.setAttribute("viewBox", SVG_VIEWBOX)
  circle = document.createElementNS(XMLNS, "circle")
  circle.setAttribute("cx", SVG_CX)
  circle.setAttribute("cy", SVG_CY)
  circle.setAttribute("r", SVG_R)
  circle.setAttribute("class", "marble marble-color-#{colornum}")
  circle.setAttribute("stroke-width", SVG_BORDER_WIDTH)
  marble.appendChild(circle)
  return marble

createContentElement = (item) ->
  content = document.createElement("p")
  content.className = "marble-content"
  content.textContent = item?.content
  return content

getLeftPosStream = (item, draggable, element) ->
  if draggable
    return getInteractiveLeftPosStream(element, item.time)
  else
    return Rx.Observable.just(item.time)

virtualRender = (marbleData) ->
  colornum = (marbleData.id % 4) + 1
  leftPos = "#{marbleData.time}%"
  content = "#{marbleData.content}"
  return h("div.marble-container", {style: {"left": leftPos}}, [
    svg("svg", {attributes: {class: "marble", viewBox: SVG_VIEWBOX}}, [
      svg("circle", {
        attributes: {
          class: "marble marble-color-#{colornum}", cx:SVG_CX, cy:SVG_CY, r:SVG_R,
          "stroke-width": SVG_BORDER_WIDTH
        }
      })
    ]),
    h("p.marble-content", {}, content)
  ])

render = (item, draggable = false) ->
  # Create DOM elements
  container = createRootElement(draggable)
  container.appendChild(createMarbleSvg(item))
  container.appendChild(createContentElement(item))
  # Define public and private streams
  leftPosStream = getLeftPosStream(item, draggable, container)
  container.dataStream = leftPosStream
    .map((leftPos) -> {time: leftPos, content: item.content, id: item.id})
  leftPosStream
    .subscribe((leftPos) ->
      container.style.left = leftPos + "%"
      return true
    )

  return container

module.exports = {
  render: render
  virtualRender: virtualRender
}
