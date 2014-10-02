/*
 * Responsible for rendering the sandbox element and connecting controller
 * streams to the views.
 */
var Rx = require('rx');
var h = require('hyperscript');
var InputDiagramView = require('rxmarbles/views/input-diagram');
var OperatorBox = require('rxmarbles/views/operator-box');
var OutputDiagramView = require('rxmarbles/views/output-diagram');
var Utils = require('rxmarbles/views/utils');

var streamOfArrayOfLiveInputDiagramStreams = new Rx.BehaviorSubject(null);

function createInputDiagramElements() {
  var InputDiagrams = require('rxmarbles/models/input-diagrams');
  var inputDiagramElements = Utils.renderObservableDOMElement(
    InputDiagrams.initial$
      .map(function(diagrams) {
        var diagramViews = [];
        for (i = 0; i < diagrams.length; i++) {
          diagramViews.push(InputDiagramView.render(diagrams[i]));
        }
        return diagramViews;
      })
      .doAction(function(diagramViews) {
        var dataStreams = [];
        for (i = 0; i < diagramViews.length; i++) {
          dataStreams.push(diagramViews[i].dataStream);
        }
        return streamOfArrayOfLiveInputDiagramStreams.onNext(dataStreams);
      })
  );
  return inputDiagramElements;
};

function createOperatorBoxElement() {
  // TODO change this with SandboxModel.operator$
  var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
  return Utils.renderObservableDOMElement(
    OperatorsMenuModel.selectedExample$
      .map(function(example) { return OperatorBox.render(example); })
  );
};

function createOutputDiagramElement() {
  var OutputDiagram = require('rxmarbles/models/output-diagram');
  return OutputDiagramView.render(OutputDiagram);
};

module.exports = {
  getStreamOfArrayOfLiveInputDiagramStreams: function() {
    return streamOfArrayOfLiveInputDiagramStreams;
  },

  render: function() {
    return h("div.sandbox", [
      createInputDiagramElements(),
      createOperatorBoxElement(),
      createOutputDiagramElement()
    ]);
  }
};
