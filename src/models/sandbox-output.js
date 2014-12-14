/*
 * Functions to handle data of the output diagram in the example shown in the
 * sandbox.
 */
var Rx = require('rx');
var Utils = require('rxmarbles/models/utils');

var MAX_VT_TIME = 100; // Time of completion

function makeScheduler() {
  var scheduler = new Rx.VirtualTimeScheduler(0, function(x, y) {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
  });
  scheduler.add = function(absolute, relative) { return absolute + relative; };
  scheduler.toDateTimeOffset = function(absolute) { return Math.floor(absolute); };
  scheduler.toRelative = function(timeSpan) { return timeSpan; };
  return scheduler;
}

function justIncomplete(item, scheduler) {
  return new Rx.AnonymousObservable(function(observer) {
    return scheduler.schedule(function() {
      observer.onNext(item);
    });
  });
}

/**
 * Creates an (virtual time) Rx.Observable from diagram
 * data (array of data items).
 */
function toVTStream(diagramData, scheduler) {
  var singleMarbleStreams = [];
  for (var i = 0; i < diagramData.length; i++) {
    var item = diagramData[i];
    singleMarbleStreams.push(
      justIncomplete(item, scheduler).delay(item.t || item.time, scheduler)
    );
  }
  // Necessary correction to include marbles at time exactly diagramData.end:
  var correctedEndTime = diagramData.end + 0.01;
  return Rx.Observable.merge(singleMarbleStreams)
    .takeUntilWithTime(correctedEndTime, scheduler)
    .publish().refCount();
}

function getDiagramPromise(stream, scheduler) {
  var diagram = [];
  var subject = new Rx.BehaviorSubject([]);
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map(function(x) {
      if (typeof x.value !== "object") {
        x.value = {content: x.value, id: Utils.calculateNotificationContentHash(x.value)};
      }
      return {
        // converts timestamp to % of MAX_VT_TIME
        time: (x.timestamp / MAX_VT_TIME) * 100,
        content: x.value.content,
        id: x.value.id
      };
    })
    .reduce(function(acc, x) {
      acc.push(x);
      return acc;
    },[])
    .subscribe(function onNext(x) {
      diagram = x;
      subject.onNext(diagram);
    }, function onError(e) {
      console.warn("Error in the diagram promise stream: "+e);
    }, function onComplete() {
      diagram.end = scheduler.now();
    });
  return subject.asObservable();
}

function getOutputDiagram$(example$, inputDiagrams$) {
  return Rx.Observable
    .combineLatest(inputDiagrams$, example$, function(diagrams, example) {
      var vtscheduler = makeScheduler();
      var inputVTStreams = [];
      for (var i = 0; i < diagrams.length; i++) {
        inputVTStreams.push(toVTStream(diagrams[i], vtscheduler));
      }
      var outputVTStream = example["apply"](inputVTStreams, vtscheduler);
      // Necessary hack to include marbles at exactly 100.01
      var correctedMaxTime = MAX_VT_TIME + 0.02;
      outputVTStream = outputVTStream.takeUntilWithTime(correctedMaxTime, vtscheduler);
      var outputDiagram = getDiagramPromise(outputVTStream, vtscheduler, MAX_VT_TIME);
      vtscheduler.start();
      return outputDiagram;
    })
    .mergeAll();
}

module.exports = {
  getOutputDiagram$: getOutputDiagram$
};
