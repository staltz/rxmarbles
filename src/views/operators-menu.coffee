#
# Renders a scrollable list of operators to be demonstrated on the sandbox.
#
h = require 'hyperscript'
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

selected$ = new Rx.Subject()

renderExampleCategory = (categoryName) ->
  return h("li.category", "#{categoryName}")

renderExampleItem = (example) ->
  link = h("a", {href: "##{example.key}"}, example.key)
  Rx.Observable.fromEvent(link, "click").subscribe(->
    selected$.onNext(example.key)
    return true
  )
  return h("li", [link])

renderExampleItems = (examples) ->
  return (renderExampleItem(example) for example in examples)

#
# Returns a hashmap of category headers to lists of examples in that category.
#
organizeExamplesByCategory = (examples) ->
  categoryMap = {}
  for own key,value of examples
    value.key = key
    if categoryMap.hasOwnProperty(value.category)
      categoryMap[value.category].push(value)
    else
      categoryMap[value.category] = [value]
  return categoryMap

renderMenuContent = (examples) ->
  listItems = []
  categoryMap = organizeExamplesByCategory(examples)
  for own categoryName,categoryExamples of categoryMap
    listItems.push(renderExampleCategory(categoryName))
    listItems = listItems.concat(renderExampleItems(categoryExamples))
  return listItems

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
    listElement = h("ul.operators-menu", renderMenuContent(Examples))
    fixListHeight(listElement)
    return listElement
}
