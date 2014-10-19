/*
 * Virtually renders stream diagrams meant as inputs to the sandbox.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var Diagram = require('rxmarbles/views/diagram');

function vrender(inputDiagrams, marbleMouseDown$, completionMouseDown$) {
  return h("div", {},
    inputDiagrams.map(function(diagramData) {
      return Diagram.vrender(diagramData, true, marbleMouseDown$, completionMouseDown$);
    })
  )
}

module.exports = {
  vrender: vrender
};
