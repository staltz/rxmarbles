import { Observable, ReplaySubject, Subject, VirtualTimeScheduler } from 'rxjs';
import { assoc, curry, merge } from 'ramda';

import { calculateNotificationContentHash } from './sandbox-utils';

const MAX_TIME = 100;

const toVTStream = curry(function _toVTStream(scheduler, data) {
  const marbleStreams$ = new Observable(observer => {
    data.marbles.forEach(item =>
      scheduler.schedule(() => observer.next(item), item.time));
  });
  return marbleStreams$
    .takeUntil(Observable.timer(data.end.time + 1, scheduler));
});

function outputStreamToMarbles$(scheduler, stream) {
  const subject$ = new ReplaySubject(1);
  const stop$ = new Subject();
  let endTime;

  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map(({ value, timestamp }) => {
      const marble = typeof value !== 'object'
        ? { content: value, id: calculateNotificationContentHash(value) }
        : value;

      return assoc('time', timestamp / MAX_TIME * 100, marble);
    })
    .takeUntil(stop$)
    .reduce((a, b) => a.concat(b), [])
    .map(items => items.map(
      (item, i) => merge(item, { itemId: i }))
    )
    .subscribe(
      items => subject$.next(items),
      undefined,
      () => endTime = scheduler.now(),
    );

  scheduler.flush();
  stop$.next();

  return subject$.asObservable()
    .map(marbles => ({ marbles, end: { time: endTime } }));
}

export function createOutputStream$(example$, inputStores$) {
  return inputStores$.debounceTime(0).withLatestFrom(example$)
    .map(([inputStores, example]) => {
      const vtScheduler = new VirtualTimeScheduler(undefined, MAX_TIME);

      const inputStreams = inputStores.map(toVTStream(vtScheduler));
      const outputStream = example.apply(inputStreams, vtScheduler)
        // add 0.01 or else things at exactly MAX_TIME will cut off
        .takeUntil(Observable.timer(MAX_TIME + 0.01, vtScheduler));

      return outputStreamToMarbles$(vtScheduler, outputStream);
    })
    .mergeAll()
    .publishReplay(1).refCount();
}
