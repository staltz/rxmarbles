/*
 * Renders a stream diagram meant as an input to the sandbox.
 */
var Rx = require('rx');
var h = require('hyperscript');
var Marble = require('rxmarbles/views/marble');
var Completion = require('rxmarbles/views/completion');

function makeDiagramBodyChildren(diagramData) {
  var marbleViews = [];
  for (var i = 0; i < diagramData.length; i++) {
    var marbleData = diagramData[i];
    marbleViews.push(Marble.render(marbleData, true));
  }
  var completionView = Completion.render(diagramData.end);
  return [completionView].concat(marbleViews);
};

function makeDataStream(diagramElement) {
  var marbleViews = diagramElement.querySelectorAll(".js-marble");
  var completionElement = diagramElement.querySelector(".js-completion");
  var marbleDataStreams = [];
  for (var i = 0; i < marbleViews.length; i++) {
    marbleDataStreams.push(marbleViews[i].dataStream);
  }
  var dataStream = Rx.Observable
    .combineLatest(marbleDataStreams, function() {
      return (1 <= arguments.length) ? Array.prototype.slice.call(arguments) : [];
    })
    .combineLatest(completionElement.dataStream, function(marblesData, endTime) {
      marblesData.end = endTime;
      return marblesData;
    });
  return dataStream;
};

//////// CoffeeScript
// makeMouseDownStream = (diagramElement) ->
//   marbleViews = diagramElement.querySelectorAll(".js-marble")
//   marbleIds = (marble.marbleId for marble in marbleViews)
//   return Marble.mouseDownStream
//     .filter((ev) -> ev.marbleId in marbleIds)

module.exports = {
  render: function(diagramData) {
    var diagramElement = h("div.diagram", {}, [
      h("div.diagram-arrow"),
      h("div.diagram-arrowHead"),
      h("div.diagram-body", {}, makeDiagramBodyChildren(diagramData))
    ]);
    diagramElement.dataStream = makeDataStream(diagramElement);
    return diagramElement;
  }
};
