import { Observable, ReplaySubject, VirtualTimeScheduler } from 'rxjs';
import { assoc, merge } from 'ramda';

import { calculateNotificationContentHash } from './sandbox-utils';

const MAX_TIME = 100;

function toVTStream(scheduler, data) {
  const marbleStreams$ = new Observable(observer => {
    data.marbles.forEach(item =>
      scheduler.schedule(() => observer.next(item), item.time));
  });
  return marbleStreams$
    .takeUntil(Observable.timer(data.end.time, scheduler))
    .publish().refCount();
}

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

export function createOutputStream$(inputsStore$, example) {
  return inputsStore$
    .map(inputsStore => {
      const vtScheduler = new VirtualTimeScheduler(undefined, MAX_TIME);

      const inputStream = toVTStream(vtScheduler, inputsStore);
      const outputStream = example.apply([inputStream], vtScheduler)
        .takeUntil(Observable.timer(MAX_TIME, vtScheduler));

      return outputStreamToMarbles$(vtScheduler, outputStream)
        .map(marbles => ({ marbles, end: { time: vtScheduler.now() } }));
    })
    .mergeAll();
}
