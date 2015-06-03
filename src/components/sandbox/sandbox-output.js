/*
 * Functions to handle data of the output diagram in the example shown in the
 * sandbox.
 */
import {Rx} from '@cycle/core';
import Utils from 'rxmarbles/components/sandbox/utils';
import Immutable from 'immutable';

const MAX_VT_TIME = 100; // Time of completion

function makeScheduler() {
  let scheduler = new Rx.VirtualTimeScheduler(0, (x, y) => {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
  });
  scheduler.add = (absolute, relative) => (absolute + relative);
  scheduler.toDateTimeOffset = (absolute => Math.floor(absolute));
  scheduler.toRelative = (timeSpan => timeSpan);
  return scheduler;
}


/**
 * Creates an (virtual time) Rx.Observable from diagram
 * data (array of data items).
 */
function toVTStream(diagramData, scheduler) {
  return Rx.Observable.create(observer => {
    let notifications = diagramData.get('notifications')
      .map(item => scheduler.scheduleWithRelative(item.get('time'), () => observer.onNext(item)))
      .toArray();
    let completion = scheduler.scheduleWithRelative(diagramData.get('end') + 0.01, () => observer.onCompleted());
    let s = new Rx.CompositeDisposable(notifications);
    s.add(completion);
    return s;
  });
}

/**
 * Wraps the observable and collects usage information
 * Each time the observable is subscribed, produces a notification stream that shows
 * - when the subscription started
 * - each notification produced
 * - when the subscription ended
 * - any remaining notifications that would have occurred had the subscription continued
 * @param stream
 * @param scheduler
 * @param correctedMaxTime
 */
function observeUsage(stream, scheduler, correctedMaxTime) {
  let subject = new Rx.Subject();
  let diagrams = subject.takeUntilWithTime(new Date(correctedMaxTime), scheduler);
  let newStream = Rx.Observable.create(observer => {
    let subscribeEnd = new Rx.AsyncSubject();
    let onUnsubscribe = Rx.Disposable.create(() => {
      subscribeEnd.onNext(scheduler.now());
      subscribeEnd.onCompleted();
    });
    let p = stream.publish();
    let diagram = diagramStream(p, scheduler, correctedMaxTime);
    let finalDiagram = diagram.combineLatest(subscribeEnd, (diagram, e) => {
      // eventualEnd is when the stream would have finished had we not unsubscribed
      diagram.eventualEnd = diagram.end;

      // end is when the observer unsubscribed (or the stream ended naturally)
      diagram.end = e;
      return diagram;
    });

    // Give the observer his information
    p.subscribe(observer);

    // watch final diagram ourselves
    subject.onNext(finalDiagram);

    // start the flow
    p.connect();

    return onUnsubscribe;
  });

  return {
    diagrams,
    stream: newStream
  };
}

function getObservedStreams(diagrams, scheduler, correctedMaxTime) {
  let observedStreams = diagrams.get('diagrams')
    .map(diagram => toVTStream(diagram, scheduler))
    .map(s => observeUsage(s, scheduler, correctedMaxTime));
  let inputStreams = observedStreams.map(s => s.stream);
  // merge all the diagram streams such that we can keep a FIFO order on the final diagrams
  let observedInputDiagramStream = Rx.Observable
    .merge(observedStreams.map(s => s.diagrams))
    .flatMap((d$, i) => d$.map(diag => {
      return {diag, i};
    }))
    .toArray()
    .map(results => results.sort((a, b) => a.i - b.i).map(r => r.diag))
    .publishLast();
  observedInputDiagramStream.connect();
  let observedInputDiagrams = observedInputDiagramStream.startWith([]);

  return {inputStreams, observedInputDiagrams};
}

function diagramStream(stream, scheduler, correctedMaxTime) {
  return Rx.Observable.defer(() => {
    let diagram = {start: scheduler.now()};
    return stream
      .observeOn(scheduler)
      .timestamp(scheduler)
      .takeUntilWithTime(new Date(correctedMaxTime), scheduler)
      .map(x => {
        if (typeof x.value !== 'object') {
          x.value = Immutable.Map({
            content: x.value,
            id: Utils.calculateNotificationContentHash(x.value)
          });
        }
        // converts timestamp to % of MAX_VT_TIME
        return x.value.set('time', (x.timestamp / MAX_VT_TIME) * 100);
      })
      .catch(e => {
        console.warn('Error in the diagram promise stream: ' + e);
        return Rx.Observable.empty();
      })
      .toArray()
      .map(notifications => {
        diagram.end = scheduler.now();
        diagram.notifications = notifications;
        return diagram;
      });
  });
}

function getDiagramPromise(stream, scheduler, correctedMaxTime) {
  let s = diagramStream(stream, scheduler, correctedMaxTime).publishLast();
  s.connect();
  return s.startWith([]);
}

function toImmutableDiagramData(diagramData) {
  return Immutable.Map({})
    .set('notifications', Immutable.List(diagramData.notifications).map(Immutable.Map))
    .set('end', diagramData.end)
    .set('start', diagramData.start)
    .set('eventualEnd', diagramData.eventualEnd || diagramData.end );
}

function getOutputDiagram$(example$, inputDiagrams$) {
  return inputDiagrams$
    .withLatestFrom(example$, (diagrams, example) => {
      let vtscheduler = makeScheduler();
      // Necessary hack to include marbles at exactly 100.01
      let correctedMaxTime = MAX_VT_TIME + 0.02;
      let { inputStreams, observedInputDiagrams } = getObservedStreams(diagrams, vtscheduler, correctedMaxTime);
      let outputVTStream = example.get('apply')(inputStreams, vtscheduler);
      let outputDiagram = getDiagramPromise(outputVTStream, vtscheduler, MAX_VT_TIME);
      vtscheduler.start();

      return outputDiagram
        .map(toImmutableDiagramData)
        .zip(observedInputDiagrams.map(diagrams => diagrams.map(toImmutableDiagramData)), (od, ids) => {
          return {
            outputDiagram: od,
            observedInputDiagrams: ids
          };
        });
    })
    .mergeAll();
}

module.exports = {
  getOutputDiagram$: getOutputDiagram$
};
