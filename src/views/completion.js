/*
 * Renders a marker for the completion notification of a stream diagram.
 */
var h = require('virtual-hyperscript');

var MARBLE_WIDTH = 5; // estimate of a marble width, in percentages

function vrender(completionData, isDraggable, diagramData, mouseDown$) {
  if (typeof isDraggable === 'undefined') {
    isDraggable = false;
  }
  var isDraggableClass = (isDraggable) ? '.is-draggable' : '';
  var isTall = false;
  diagramData.forEach(function (marbleData) {
    if (Math.abs(marbleData.time - completionData.time) <= MARBLE_WIDTH*0.5) {
      isTall = true;
    }
  });
  var isTallClass = (isTall) ? '.is-tall' : '';
  return h('div.diagramCompletion' + isDraggableClass + isTallClass, {
    style: {'left': completionData.time + '%'},
    attributes: {'data-diagram-id': completionData.diagramId},
    'ev-mousedown': function(ev) { if (mouseDown$) { mouseDown$.onNext(ev); } }
  },[
    h('div.diagramCompletion-inner')
  ]);
}

module.exports = {
  vrender: vrender
};
