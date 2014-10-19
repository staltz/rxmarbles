/*
 * Renders a marker for the completion notification of a stream diagram.
 */
var h = require('hyperscript');
var vh = require('virtual-hyperscript');
var Utils = require('rxmarbles/views/utils');

var MARBLE_WIDTH = 5; // estimate of a marble width, in percentages

function render(completionTime) {
  var element = h('div.diagramCompletion.is-draggable.js-completion', {}, [
    h('div.diagramCompletion-inner')
  ]);
  element.dataStream = Utils.getInteractiveLeftPosStream(element, completionTime);
  element.dataStream
    .subscribe(function(leftPos) {
      element.style.left = leftPos + '%';
      return true;
    });
  return element;
}

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
  return vh('div.diagramCompletion' + isDraggableClass + isTallClass, {
    style: {'left': completionData.time + '%'},
    attributes: {'data-diagram-id': completionData.diagramId},
    'ev-mousedown': function(ev) { if (mouseDown$) { mouseDown$.onNext(ev); } }
  },[
    vh('div.diagramCompletion-inner')
  ]);
}

module.exports = {
  render: render,
  vrender: vrender
};
