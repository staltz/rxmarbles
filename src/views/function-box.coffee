#
# Renders a box representing the Reactive function being applied on the input
# streams.
#
h = require 'hyperscript'
Rx = require 'rx'

module.exports = {
  render: (label) ->
    functionBoxElement = h("div.function-box", [
      h("span.function-box-label", label)
      select = h("select", [
        # h("optgroup", {label:"Type 1 functions"}, [
        h("option", {value:"amb"}, "amb()")
        h("option", {value:"concat"}, "concat()")
        h("option", {value:"merge"}, "merge()")
        # ])
        # h("optgroup", {label:"Type 2 functions"}, [
        #   h("option", {value:"debounce"}, "debounce()")
        #   h("option", {value:"delay"}, "delay()")
        #   h("option", {value:"take"}, "take()")
        # ])
      ])
      h("div.function-box-dropdown", [
        h("span.function-box-dropdown-arrow")
      ])
    ])
    Rx.Observable.fromEvent(functionBoxElement, "click").subscribe(->
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      select.dispatchEvent(event)
      return true
    )
    return functionBoxElement
}
