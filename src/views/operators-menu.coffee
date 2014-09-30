#
# Renders a scrollable list of operators to be demonstrated on the sandbox.
#
h = require 'virtual-hyperscript'
Rx = require 'rx'

vtree$ = new Rx.BehaviorSubject()
click$ = new Rx.Subject()

observe = (model) ->
  model.examples$
    .map((examples) ->
      listElement = h("ul.operatorsMenu", renderMenuContent(examples))
      return listElement
    )
    .subscribe((element) -> vtree$.onNext(element))
  return true

renderMenuContent = (examples) ->
  listItems = []
  categoryMap = organizeExamplesByCategory(examples)
  for own categoryName,categoryExamples of categoryMap
    listItems.push(renderExampleCategory(categoryName))
    listItems = listItems.concat(renderExampleItems(categoryExamples))
  listItems.push(h("li.operatorsMenu-category", "More"))
  listItems.push(h("li.operatorsMenu-item", "Coming soon..."))
  return listItems

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

renderExampleCategory = (categoryName) ->
  return h("li.operatorsMenu-category", "#{categoryName}")

renderExampleItems = (examples) ->
  return (renderExampleItem(example) for example in examples)

renderExampleItem = (example) ->
  link = h("a",
    {"href": "##{example.key}", "ev-click": (ev)->click$.onNext(ev)},
    example.key
  )
  return h("li.operatorsMenu-item", [link])

module.exports = {
  observe: observe
  click$: click$
  vtree$: vtree$
}
