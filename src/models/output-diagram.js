/*
 * Exports the diagram stream representing the output diagram.
 */
var Rx = require('rx');
var Utils = require('rxmarbles/models/utils');
var InputDiagrams = require('rxmarbles/models/input-diagrams');
// TODO Change below with SandboxModel.example
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');

var MAXTIME = 100; // Time of completion

var outputDiagramStream = InputDiagrams.continuous$
  .filter(function(x) { return (x !== null); })
  .flatMapLatest(function(arrayOfDiagramStreams) {
    return Rx.Observable.combineLatest(arrayOfDiagramStreams, function() {
      return (1 <= arguments.length) ? Array.prototype.slice.call(arguments) : [];
    });
  })
  .combineLatest(OperatorsMenuModel.selectedExample$, function(diagrams, example) {
    var vtscheduler = Utils.makeScheduler();
    var inputVTStreams = [];
    for (var i = 0; i < diagrams.length; i++) {
      inputVTStreams.push(Utils.toVTStream(diagrams[i], vtscheduler));
    }
    var outputVTStream = example["apply"](inputVTStreams, vtscheduler);
    // Necessary hack to include marbles at exactly 100.01
    var correctedMaxTime = MAXTIME + 0.02;
    outputVTStream = outputVTStream.takeUntilWithTime(correctedMaxTime, vtscheduler);
    var outputDiagram = Utils.getDiagramPromise(outputVTStream, vtscheduler, MAXTIME);
    vtscheduler.start();
    return outputDiagram;
  })
  .mergeAll();

module.exports = outputDiagramStream;
