import { Observable, timer, ReplaySubject, Subject, VirtualTimeScheduler } from 'rxjs';
import {
  debounceTime,
  withLatestFrom,
  map,
  mergeAll,
  publishReplay,
  refCount,
  takeUntil,
  observeOn,
  timestamp,
  reduce
} from 'rxjs/operators'
import { assoc, curry, merge } from 'ramda';

import { calculateNotificationContentHash } from './sandbox-utils';

// add 0.01 or else things at exactly MAX_TIME will cut off
const PAD_TIME = 0.1
const MAX_TIME = 100 + PAD_TIME;

const toVTStream = curry(function _toVTStream(scheduler, data) {
  const marbleStreams$ = new Observable(observer => {
    data.marbles.forEach(item =>
      scheduler.schedule(() => observer.next(item), item.time));
  });
  return marbleStreams$.pipe(takeUntil(timer(data.end.time + PAD_TIME, scheduler))
)
});

function outputStreamToMarbles$(scheduler, stream) {
  const subject$ = new ReplaySubject(1);
  const stop$ = new Subject();
  let endTime;

  stream
    .pipe(
      observeOn(scheduler),
      timestamp(scheduler),
      map(({ value, timestamp }) => {
        const marble = typeof value !== 'object'
          ? { content: value, id: calculateNotificationContentHash(value) }
          : value;
        return assoc('time', timestamp / MAX_TIME * 100, marble);
      }),
      takeUntil(stop$),
      reduce((a, b) => a.concat(b), []),
      map(items =>
        items.map((item, i) => merge(item, { itemId: i }))
      )
    )
    .subscribe({
       next(items) {
         subject$.next(items)
       },
       complete() {
         endTime = scheduler.now()
       }
    });

  scheduler.flush();
  stop$.next();

  return subject$.asObservable().pipe(
      map(marbles => ({ marbles, end: { time: endTime } }))
    )
}

export function createOutputStream$(example$, inputStores$) {
  return inputStores$.pipe(
    debounceTime(0),
    withLatestFrom(example$),
    map(([inputStores, example]) => {
      const vtScheduler = new VirtualTimeScheduler(undefined, MAX_TIME);

      const inputStreams = inputStores.map(toVTStream(vtScheduler));
      const outputStream = example.apply(inputStreams, vtScheduler)
        .pipe(takeUntil(timer(MAX_TIME, vtScheduler)));

      return outputStreamToMarbles$(vtScheduler, outputStream);
    }),
    mergeAll(),
    publishReplay(1),
    refCount()
  );
}
