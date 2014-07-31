Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'
VDOM = {
  h: require 'virtual-dom/h'
  diff: require 'virtual-dom/diff'
  patch: require 'virtual-dom/patch'
  createElement: require 'virtual-dom/create-element'
}
VNode = require 'vtree/vnode'
XMLNS = "http://www.w3.org/2000/svg"

#
# Renders a stream diagram meant as an output to the sandbox
#

# module.exports = {
#   render: (diagramData) ->
#     return Diagram.render({data: diagramData, draggable: false})
# }

virtualRender = (diagramData) ->
  if diagramData is null
    return VDOM.h("div.diagram", {}, [])
  else
    children = []
    children.push(VDOM.h("div.arrow", {}, []))
    children.push(VDOM.h("div.arrow-head", {}, []))
    marbles = []
    for marbleData in diagramData
      colornum = (marbleData.id % 4) + 1
      debugger;
      marbles.push(VDOM.h("div.marble-container", {style:{"left": "#{marbleData.time}%"}}, [
        new VNode("svg", {attributes: {class: "marble", viewBox: "0 0 1 1"}}, [
          new VNode("circle", {
            attributes: {
              class: "marble marble-color-#{colornum}", cx: 0.5, cy: 0.5, r: 0.5,
            }
            style: {
              "stroke-width": "0.07"
            }
          }, [], null, XMLNS)
        ], null, XMLNS),
        VDOM.h("p.marble-content", {}, "#{marbleData.content}")
      ]))
    children.push(VDOM.h("div.marbles", {}, marbles))
    return VDOM.h("div.diagram", {}, children)


module.exports = {
  # options.data is a diagram data array
  # options.draggable is a boolean
  render: (diagramDataStream) ->
    tree = virtualRender(null)
    rootNode = VDOM.createElement(tree)

    diagramDataStream.subscribe((diagram) ->
      debugger;
      newTree = virtualRender(diagram)
      patches = VDOM.diff(tree, newTree)
      rootNode = VDOM.patch(rootNode, patches)
      tree = newTree
      return true
    )

    return rootNode
}

