#
# Renders a box representing the Reactive function being applied on the input
# streams.
#
h = require 'hyperscript'
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

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

module.exports = {
  render: (label) ->
    functionBoxElement = h("div.function-box", [
      h("span.function-box-label", label)
      selectElement = h("select", renderSelectOptionsArray(Examples))
      h("div.function-box-dropdown", [
        h("span.function-box-dropdown-arrow")
      ])
    ])
    setupClickBehavior(functionBoxElement, selectElement)
    return functionBoxElement
}
