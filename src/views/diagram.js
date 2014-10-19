/*
 * Virtually renders a stream diagram.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var Marble = require('rxmarbles/views/marble');
var Completion = require('rxmarbles/views/completion');

function vrender(diagramData, isInteractive, marbleMouseDown$, completionMouseDown$) {
  if (typeof isInteractive === 'undefined') {
    isInteractive = false;
  }
  var marblesVTree = diagramData
    .map(function(marbleData) {
      return Marble.vrender(marbleData, isInteractive, marbleMouseDown$);
    });
  var completionData = {time: diagramData.end, diagramId: diagramData.id};
  var completionVTree = Completion.vrender(
    completionData, isInteractive, diagramData, completionMouseDown$
  );
  return h('div.diagram', {}, [
    h('div.diagram-arrow'),
    h('div.diagram-arrowHead'),
    h('div.diagram-body', {}, [completionVTree].concat(marblesVTree))
  ]);
}

module.exports = {
  vrender: vrender
};
