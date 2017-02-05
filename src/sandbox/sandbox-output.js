import { Observable, ReplaySubject, VirtualTimeScheduler } from 'rxjs';
import { assoc, curry, merge } from 'ramda';

import { calculateNotificationContentHash } from './sandbox-utils';

const MAX_TIME = 100;

const toVTStream = curry(function _toVTStream(scheduler, data) {
  const marbleStreams$ = new Observable(observer => {
    data.marbles.forEach(item =>
      scheduler.schedule(() => observer.next(item), item.time));
  });
  return marbleStreams$
    .takeUntil(Observable.timer(data.end.time, scheduler))
    .publish().refCount();
});

function outputStreamToMarbles$(scheduler, stream) {
  const subject$ = new ReplaySubject(1);

  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map(({ value, timestamp }) => ({
      content: value,
      id: calculateNotificationContentHash(value),
      time: timestamp / MAX_TIME * 100,
    }))
    .reduce((a, b) => a.concat(b), [])
    .map(items => items.map(
      (item, i) => merge(item, { itemId: i, _itemId: i }))
    )
    .subscribe(items => subject$.next(items));

  scheduler.flush();

  return subject$.asObservable();
}

export function createOutputStream$(inputStores$, example) {
  return inputStores$
    .map(inputStores => {
      const vtScheduler = new VirtualTimeScheduler(undefined, MAX_TIME);

      const inputStreams = inputStores.map(toVTStream(vtScheduler));
      const outputStream = example.apply(inputStreams, vtScheduler)
        .takeUntil(Observable.timer(MAX_TIME, vtScheduler));

      return outputStreamToMarbles$(vtScheduler, outputStream)
        .map(marbles => ({ marbles, end: { time: vtScheduler.now() } }));
    })
    .mergeAll();
}
