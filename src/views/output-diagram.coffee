Rx = require 'rx'
h = require 'virtual-hyperscript'
svg = require 'virtual-hyperscript/svg'
VDOM = {
  createElement: require 'virtual-dom/create-element'
  diff: require 'virtual-dom/diff'
  patch: require 'virtual-dom/patch'
}

#
# Renders a stream diagram meant as an output to the sandbox
#

virtualRenderOutputMarble = (marbleData) ->
  colornum = (marbleData.id % 4) + 1
  leftPos = "#{marbleData.time}%"
  content = "#{marbleData.content}"
  return h("div.marble-container", {style: {"left": leftPos}}, [
    svg("svg", {attributes: {class: "marble", viewBox: "0 0 1 1"}}, [
      svg("circle", {
        attributes: {
          class: "marble marble-color-#{colornum}", cx:0.5, cy:0.5, r:0.5,
        }
        style: { "stroke-width": "0.07" }
      })
    ]),
    h("p.marble-content", {}, content)
  ])

virtualRenderMarbles = (diagramData) ->
  return h("div.marbles", (virtualRenderOutputMarble(m) for m in diagramData))

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

