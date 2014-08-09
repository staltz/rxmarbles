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

virtualRenderMarbles = (diagramData) ->
  return h("div.marbles", (Marble.virtualRender(m) for m in diagramData))

virtualRender = (diagramData) ->
  if diagramData is null
    return h("div.diagram")
  else
    children = []
    children.push(h("div.arrow"))
    children.push(h("div.arrow-head"))
    children.push(virtualRenderMarbles(diagramData))
    return h("div.diagram", {}, children)

module.exports = {
  # options.data is a diagram data array
  # options.draggable is a boolean
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
