/*
 * Virtually renders a stream diagram meant as the output of the sandbox.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var Diagram = require('rxmarbles/views/diagram');

function vrender(outputDiagram) {
  return Diagram.vrender(outputDiagram, false);
}

module.exports = {
  vrender: vrender
};
