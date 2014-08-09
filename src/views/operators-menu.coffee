#
# Renders a scrollable list of operators to be demonstrated on the sandbox.
#
h = require 'hyperscript'
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

selected$ = new Rx.Subject()

renderMenuItem = (example) ->
  link = h("a", {href: "##{example.key}"}, example.key)
  Rx.Observable.fromEvent(link, "click").subscribe(->
    selected$.onNext(example.key)
    return true
  )
  return h("li", [link])

module.exports = {
  getSelected$: ->
    return selected$

  render: ->
    menuItems = []
    for own key,value of Examples
      value.key = key
      menuItems.push(value)
    return h("ul.operators-menu",
      (renderMenuItem(example) for example in menuItems)
    )
}
