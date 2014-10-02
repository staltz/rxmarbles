/*
 * Renders a stream diagram meant as an output to the sandbox.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var Marble = require('rxmarbles/views/marble');
var Completion = require('rxmarbles/views/completion');
var VDOM = {
  createElement: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
};

function makeDiagramBodyChildren(diagramData) {
  var marbleViews = [];
  for (i = 0; i < diagramData.length; i++) {
    marbleViews.push(Marble.virtualRender(diagramData[i]));
  }
  var children = [Completion.virtualRender(diagramData.end)].concat(marbleViews);
  return children;
};

function virtualRender(diagramData) {
  if (diagramData === null) {
    return h("div.diagram");
  } else {
    return h("div.diagram", {}, [
      h("div.diagram-arrow"),
      h("div.diagram-arrowHead"),
      h("div.diagram-body", {}, makeDiagramBodyChildren(diagramData))
    ]);
  }
};

module.exports = {
  // options.data is a diagram data array
  render: function(diagramDataStream) {
    var tree = virtualRender(null);
    var rootNode = VDOM.createElement(tree);
    diagramDataStream.subscribe(function(diagram) {
      var newTree = virtualRender(diagram);
      rootNode = VDOM.patch(rootNode, VDOM.diff(tree, newTree));
      tree = newTree;
    });
    return rootNode;
  }
};
