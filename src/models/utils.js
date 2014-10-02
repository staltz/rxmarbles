/*
 * Conversion from virtual time streams out to diagram data, and
 * vice-versa, and related functions.
 */
var Rx = require('rx');

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
};

function calculateNotificationContentHash(content) {
  if (typeof content === "string") {
    return content.split("")
      .map(function(x) { return x.charCodeAt(0); })
      .reduce(function(x, y) { return x + y; });
  } else if (typeof content === "number") {
    var SOME_PRIME_NUMBER = 877;
    return content * SOME_PRIME_NUMBER;
  }
};

function calculateNotificationHash(marbleData) {
  var SMALL_PRIME = 7;
  var LARGE_PRIME = 1046527;
  var MAX = 100000;
  var contentHash = calculateNotificationContentHash(marbleData.content);
  return ((marbleData.time + contentHash + SMALL_PRIME) * LARGE_PRIME) % MAX;
};

function justIncomplete(item, scheduler) {
  return new Rx.AnonymousObservable(function(observer) {
    return scheduler.schedule(function() {
      observer.onNext(item);
    });
  });
};

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
};

function getDiagramPromise(stream, scheduler, maxTime) {
  var diagram = [];
  var subject = new Rx.BehaviorSubject([]);
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map(function(x) {
      if (typeof x.value !== "object") {
        x.value = {content: x.value, id: calculateNotificationContentHash(x.value)};
      }
      return {
        time: (x.timestamp / maxTime) * 100, // converts timestamp to % of maxTime
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
    }, function onError() {
      console.warn("Error in the diagram promise stream");
    }, function onComplete() {
      diagram.end = scheduler.now();
    });
  return subject.asObservable();
};

module.exports = {
  makeScheduler: makeScheduler,
  toVTStream: toVTStream,
  calculateNotificationHash: calculateNotificationHash,
  getDiagramPromise: getDiagramPromise
};
