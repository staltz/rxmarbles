/*
 * Renders a marker for the completion notification of a stream diagram.
 */
var h = require('hyperscript');
var vh = require('virtual-hyperscript');
var Utils = require('rxmarbles/views/utils');

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

function vrender(completionData, isDraggable, mouseDown$) {
  if (typeof isDraggable === 'undefined') {
    isDraggable = false;
  }
  return vh('div.diagramCompletion'+(isDraggable ? '.is-draggable' : ''), {
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
