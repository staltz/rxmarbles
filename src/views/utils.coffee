#
# Util functions for rendering to the DOM.
#

module.exports = {
  renderObservableDOMElement: (elementStream) ->
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
}
