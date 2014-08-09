#
# Renders a scrollable list of operators to be demonstrated on the sandbox.
#
h = require 'hyperscript'
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

selected$ = new Rx.Subject()

getDocumentHeight = ->
  body = document.body
  html = document.documentElement
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

renderMenuItem = (example) ->
  link = h("a", {href: "##{example.key}"}, example.key)
  Rx.Observable.fromEvent(link, "click").subscribe(->
    selected$.onNext(example.key)
    return true
  )
  return h("li", [link])

fixListHeight = (listElement) ->
  Rx.Observable.timer(1).subscribe(->
    height = getDocumentHeight() - listElement.getBoundingClientRect().top
    listElement.style.height = "#{height}px"
    return true
  )

module.exports = {
  getSelected$: ->
    return selected$

  render: ->
    menuItems = []
    for own key,value of Examples
      value.key = key
      menuItems.push(value)
    listElement = h("ul.operators-menu",
      (renderMenuItem(example) for example in menuItems)
    )
    fixListHeight(listElement)
    return listElement
}
