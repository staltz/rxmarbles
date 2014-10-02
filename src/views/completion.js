/*
 * Renders a marker for the completion notification of a stream diagram.
 */
var h = require('hyperscript');
var vh = require('virtual-hyperscript');
var Utils = require('rxmarbles/views/utils');

function render(completionTime) {
  var element = h("div.diagramCompletion.is-draggable.js-completion", {}, [
    h("div.diagramCompletion-inner")
  ]);
  element.dataStream = Utils.getInteractiveLeftPosStream(element, completionTime);
  element.dataStream
    .subscribe(function(leftPos) {
      element.style.left = leftPos + "%";
      return true;
    });
  return element;
};

function virtualRender(completionTime) {
  return vh("div.diagramCompletion", {style: {"left": completionTime + "%"}}, [
    vh("div.diagramCompletion-inner")
  ]);
};

module.exports = {
  render: render,
  virtualRender: virtualRender
};
