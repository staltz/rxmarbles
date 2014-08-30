#
# Renders a stream diagram meant as an output to the sandbox.
#
Rx = require 'rx'
h = require 'virtual-hyperscript'
Marble = require 'rxmarbles/views/marble'
VDOM = {
  createElement: require 'virtual-dom/create-element'
  diff: require 'virtual-dom/diff'
  patch: require 'virtual-dom/patch'
}

virtualRender = (diagramData) ->
  if diagramData is null
    return h("div.diagram")
  else
    return h("div.diagram", {}, [
      h("div.diagram-arrow")
      h("div.diagram-arrowHead")
      h("div.diagram-body", (Marble.virtualRender(m) for m in diagramData))
    ])

module.exports = {
  # options.data is a diagram data array
  render: (diagramDataStream) ->
    tree = virtualRender(null)
    rootNode = VDOM.createElement(tree)
    diagramDataStream.subscribe((diagram) ->
      newTree = virtualRender(diagram)
      patches = VDOM.diff(tree, newTree)
      rootNode = VDOM.patch(rootNode, patches)
      tree = newTree
      return true
    )
    return rootNode
}
