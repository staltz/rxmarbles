/*
 * Functions to handle data of the output diagram in the example shown in the
 * sandbox.
 */
import {Rx} from 'cyclejs';
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

function justIncomplete(item, scheduler) {
  return new Rx.AnonymousObservable(observer =>
    scheduler.schedule(() => { observer.onNext(item); })
  );
}

/**
 * Creates an (virtual time) Rx.Observable from diagram
 * data (array of data items).
 */
function toVTStream(diagramData, scheduler) {
  let singleMarbleStreams = diagramData.get('notifications').map(item =>
    justIncomplete(item, scheduler).delay(item.get('time'), scheduler)
  ).toArray();
  // Necessary correction to include marbles at time exactly diagramData.end:
  let correctedEndTime = diagramData.get('end') + 0.01;
  return Rx.Observable.merge(singleMarbleStreams)
    .takeUntilWithTime(correctedEndTime, scheduler)
    .publish().refCount();
}

function getDiagramPromise(stream, scheduler) {
  let diagram = {};
  let subject = new Rx.BehaviorSubject([]);
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
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
    .reduce((acc, x) => {
      acc.push(x);
      return acc;
    },[])
    .subscribe(function onNext(x) {
      diagram.notifications = x;
      subject.onNext(diagram);
    }, function onError(e) {
      console.warn('Error in the diagram promise stream: ' + e);
    }, function onComplete() {
      diagram.end = scheduler.now();
    });
  return subject.asObservable();
}

function toImmutableDiagramData(diagramData) {
  return Immutable.Map({})
    .set('notifications', Immutable.List(diagramData.notifications).map(Immutable.Map))
    .set('end', diagramData.end);
}

function getOutputDiagram$(example$, inputDiagrams$) {
  return inputDiagrams$
    .withLatestFrom(example$, (diagrams, example) => {
      let vtscheduler = makeScheduler();
      let inputVTStreams = diagrams.get('diagrams')
        .map(diagram => toVTStream(diagram, vtscheduler));
      let outputVTStream = example.get('apply')(inputVTStreams, vtscheduler);
      // Necessary hack to include marbles at exactly 100.01
      let correctedMaxTime = MAX_VT_TIME + 0.02;
      outputVTStream = outputVTStream.takeUntilWithTime(correctedMaxTime, vtscheduler);
      let outputDiagram = getDiagramPromise(outputVTStream, vtscheduler, MAX_VT_TIME);
      vtscheduler.start();
      return outputDiagram.map(toImmutableDiagramData);
    })
    .mergeAll();
}

module.exports = {
  getOutputDiagram$: getOutputDiagram$
};
