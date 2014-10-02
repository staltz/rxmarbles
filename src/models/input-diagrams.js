/*
 * Exports an array of diagram streams representing the input diagrams.
 */
var Rx = require('rx');
// TODO change below with SandboxModel.example
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
var Utils = require('rxmarbles/models/utils');
var Sandbox = require('rxmarbles/views/sandbox');

var arrayOfInitialInputDiagrams$ = new Rx.BehaviorSubject(null);

function prepareNotification(input) {
  if (typeof input.time !== "undefined") {
    return input;
  }
  var output = {
    time: input.t,
    content: input.d
  };
  output.id = Utils.calculateNotificationHash(output);
  return output;
};

function getNotifications(diagram) {
  var last = diagram[diagram.length - 1];
  if (typeof last === 'number') {
    return diagram.slice(0, -1);
  } else {
    return diagram;
  }
};

function prepareInputDiagram(diagram, indexInArray) {
  if (indexInArray == null) {
    indexInArray = 0;
  }
  var notifications = getNotifications(diagram);
  var last = diagram[diagram.length - 1];
  var preparedDiagram = [];
  for (var i = 0; i < notifications.length; i++) {
    preparedDiagram.push(prepareNotification(notifications[i]));
  }
  preparedDiagram.end = (typeof last === 'number') ? last : 100;
  preparedDiagram.id = indexInArray;
  return preparedDiagram;
};

OperatorsMenuModel.selectedExample$
  .map(function(example) {
    return example["inputs"].map(prepareInputDiagram);
  })
  .subscribe(function(arrayOfDiagrams) {
    arrayOfInitialInputDiagrams$.onNext(arrayOfDiagrams);
  });

var continuous$ = Sandbox.getStreamOfArrayOfLiveInputDiagramStreams();

module.exports = {
  initial$: arrayOfInitialInputDiagrams$,
  continuous$: continuous$
};
