import { div } from '@cycle/dom';
import { combineLatest, of } from 'rxjs';
import {
  pluck,
  skip,
  distinctUntilChanged,
  map as mapOperator,
  publishReplay,
  refCount,
  switchMap,
  filter,
  debounceTime,
  withLatestFrom,
  startWith
} from 'rxjs/operators'
import { apply, flip, identity, length, map, merge, prop, zip } from 'ramda';

import { Collection } from '../../collection';
import { examples } from '../../data';
import { bgWhite } from '../../styles';
import { merge as mergeStyles, elevation1 } from '../../styles/utils';

import { Timeline } from '../timeline';

import { createOutputStream$ } from './sandbox-output';
import { inputsToTimelines } from './sandbox-input';
import { renderOperatorBox } from './operator-label';


const sandboxStyle = mergeStyles(bgWhite, elevation1, { borderRadius: '2px' });

export function Sandbox({ DOM, store }) {
  const example$ = store.pipe(
      pluck('route'),
      skip(1), // blank first route
      distinctUntilChanged(),
      mapOperator(exampleKey => examples[exampleKey]),
      publishReplay(1),
      refCount()
  );

  const inputStores$ = example$
    .pipe(
      switchMap(example =>
        store.pipe(
          pluck('inputs'),
          filter(identity),
          // bug: For some reason inputDataList$ emits old value after
          // route change. Skip it.
          skip(1),
          startWith(inputsToTimelines(example.inputs))
        )
      ),
      publishReplay(1),
      refCount()
    )

  const outputStore$ = createOutputStream$(example$, inputStores$);
  const outputTimelineSources$ = {
    DOM,
    marbles: outputStore$.pipe(pluck('marbles')),
    end: outputStore$.pipe(pluck('end')),
    interactive: of(false)
  };

  const inputTimelines$
    = Collection.gather(Timeline, { DOM }, inputStores$, 'id')
      .publishReplay(1).refCount()
  const outputTimeline = Timeline(outputTimelineSources$);

  const inputDOMs$ = Collection.pluck(inputTimelines$, prop('DOM'));
  const inputDataList$ = Collection.pluck(inputTimelines$, prop('data'))
    .pipe(
      filter(length),
      debounceTime(0),
      withLatestFrom(inputStores$, zip),
      mapOperator(map(apply(flip(merge))))
    );

  const vtree$ = combineLatest(inputDOMs$, outputTimeline.DOM, example$)
    .pipe(
      mapOperator(([inputsDOMs, outputDOM, example]) =>
        div({ style: sandboxStyle }, [
          ...inputsDOMs,
          renderOperatorBox(example.label),
          outputDOM,
        ]),
      )
    );

  return {
    DOM: vtree$,
    data: inputDataList$.pipe(mapOperator((inputs) => ({ inputs }))),
  };
}
