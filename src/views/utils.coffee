#
# Util functions for rendering to the DOM.
#
Rx = require 'rx'

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

renderObservableDOMElement = (elementStream) ->
  wrapper = document.createElement("div")
  elementStream.subscribe((thing) ->
    wrapper.innerHTML = ""
    if Array.isArray(thing)
      for element in thing
        wrapper.appendChild(element)
    else if thing instanceof Element
      wrapper.appendChild(thing)
    return true
  )
  return wrapper

module.exports = {
  renderObservableDOMElement: renderObservableDOMElement
  getInteractiveLeftPosStream: getInteractiveLeftPosStream
}
