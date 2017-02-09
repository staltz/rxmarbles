import { div } from '@cycle/dom';
import { Observable } from 'rxjs';
import { apply, flip, identity, length, map, merge, prop, zip } from 'ramda';

import { Collection } from '../../collection';
import { examples } from '../../data';
import { bgWhite } from '../../styles';
import { merge as mergeStyles, elevation1 } from '../../styles/utils';

import { Timeline } from '../timeline';

import { createOutputStream$ } from './sandbox-output';
import { inputsToTimelines } from './sandbox-input';
import { renderOperatorBox } from './operator-label';;


const sandboxStyle = mergeStyles(bgWhite, elevation1, { borderRadius: '2px' });

export function Sandbox({ DOM, store }) {
  const example$ = store.pluck('route')
    .skip(1) // blank first route
    .distinctUntilChanged()
    .map(exampleKey => examples[exampleKey])
    .publishReplay(1).refCount();

  const newRouteInputs$ = example$
    .pluck('inputs')
    .map(inputsToTimelines);
  const storeInputs$ = store.pluck('inputs')
    .filter(identity);
  const inputStores$ = Observable.merge(newRouteInputs$, storeInputs$)
    .distinctUntilChanged()
    .publishReplay(1).refCount();

  const outputStore$ = createOutputStream$(example$, inputStores$);
  const outputTimelineSources$ = {
    DOM,
    marbles: outputStore$.pluck('marbles'),
    end: outputStore$.pluck('end'),
  };

  const inputTimelines$
    = Collection.gather(Timeline, { DOM }, inputStores$, 'id');
  const outputTimeline = Timeline(outputTimelineSources$);

  const inputDOMs$ = Collection.pluck(inputTimelines$, prop('DOM'));
  const inputDataList$ = Collection.pluck(inputTimelines$, prop('data'))
    .filter(length)
    .debounceTime(0)
    .withLatestFrom(inputStores$, zip)
    .map(map(apply(flip(merge))));

  const vtree$ = Observable
    .combineLatest(inputDOMs$, outputTimeline.DOM, example$)
    .map(([inputsDOMs, outputDOM, example]) =>
      div({ style: sandboxStyle }, [
        ...inputsDOMs,
        renderOperatorBox(example.label),
        outputDOM,
      ]),
    );

  return {
    DOM: vtree$,
    data: inputDataList$.map((inputs) => ({ inputs })),
  };
}
