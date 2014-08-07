#
# Renders a box representing the Rx operator being applied on the input
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

setupClickBehavior = (operatorBoxElement, selectElement) ->
  Rx.Observable.fromEvent(operatorBoxElement, "click").subscribe(->
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
    operatorBoxElement = h("div.operator-box", [
      h("span.operator-box-label", example.label)
      selectElement = h("select", renderSelectOptionsArray(Examples))
      dropdown = h("div.operator-box-dropdown", [
        h("span.operator-box-dropdown-arrow")
      ])
    ])
    selectElement.value = example.key
    setupClickBehavior(operatorBoxElement, selectElement)
    return operatorBoxElement
}
