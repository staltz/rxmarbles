#
# Renders a box representing the Reactive function being applied on the input
# streams.
#
h = require 'hyperscript'
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

selected$ = new Rx.Subject()

renderSelectOptionsArray = (examples) ->
  options = []
  for key,example of examples
    if not examples.hasOwnProperty(key)
      continue
    options.push(h("option", {value: key}, example["label"]))
  return options

setupClickBehavior = (functionBoxElement, selectElement) ->
  Rx.Observable.fromEvent(functionBoxElement, "click").subscribe(->
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    selectElement.dispatchEvent(event)
    return true
  )
  # We should use Rx.Observable.from(selectElement, "change") but it doesnt work
  selectElement.addEventListener("change", (ev) ->
    selected$.onNext(ev.target.value)
    return true
  )
  return true

module.exports = {
  getSelected$: ->
    return selected$

  render: (example) ->
    functionBoxElement = h("div.function-box", [
      h("span.function-box-label", example.label)
      selectElement = h("select", renderSelectOptionsArray(Examples))
      dropdown = h("div.function-box-dropdown", [
        h("span.function-box-dropdown-arrow")
      ])
    ])
    selectElement.value = example.key
    setupClickBehavior(functionBoxElement, selectElement)
    return functionBoxElement
}
