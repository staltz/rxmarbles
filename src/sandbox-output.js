import { Observable, ReplaySubject, VirtualTimeScheduler } from 'rxjs';
import { assoc, merge } from 'ramda';

import {
  inputsToMarbles,
  calculateNotificationContentHash
} from './sandbox-utils';

const MAX_TIME = 100;

function toVTStream(scheduler, data) {
  const marbleStreams$ = new Observable(observer => {
    data.forEach(item =>
      scheduler.schedule(() => observer.next(item), item.time));
  });
  return marbleStreams$
    .takeUntil(Observable.timer(MAX_TIME, scheduler))
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

export function createMarbleStreams$(example) {
  const inputs = example.inputs;
  const inputMarbles = inputsToMarbles(inputs)[0];

  const vtScheduler = new VirtualTimeScheduler(undefined, MAX_TIME);

  const inputStream = toVTStream(vtScheduler, inputMarbles);
  const outputStream = example.apply([inputStream], vtScheduler)
    .takeUntil(Observable.timer(MAX_TIME, vtScheduler));

  return {
    inputs: Observable.of(inputMarbles),
    output: outputStreamToMarbles$(vtScheduler, outputStream),
  };
}
