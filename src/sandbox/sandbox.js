import { div } from '@cycle/dom';
import { Observable } from 'rxjs';
import { length, merge, prop } from 'ramda';

import { Collection } from '../collection';
import { Timeline } from '../timeline/timeline';
import { examples } from '../data';

import { createOutputStream$ } from './sandbox-output';

export function Sandbox(sources) {
  const example = examples.merge;
  const inputStores$ = sources.store.pluck('inputs');
  const outputStore$ = createOutputStream$(inputStores$, example);

  const inputTimelinesSources$ = inputStores$.map(
    // id for collection's consumable identifier
    inputs => inputs.map((store, index) => ({ store, id: index }))
  )
  const outputTimelineSources$ = merge(sources, { store: outputStore$ });

  const inputTimelines$
    = Collection.gather(Timeline, sources, inputTimelinesSources$);
  const outputTimeline = Timeline(outputTimelineSources$); 

  const inputDOMs$ = Collection.pluck(inputTimelines$, prop('DOM'));
  const inputDataList$ = Collection.pluck(inputTimelines$, prop('data'))
    .filter(length);

  const vtree$ = Observable
    .combineLatest(inputDOMs$, outputTimeline.DOM)
    .map(([inputsDOMs, outputDOM]) =>
      div([
        ...inputsDOMs,
        outputDOM,
      ]),
    );

  return {
    DOM: vtree$,
    data: inputDataList$.map((inputs) => ({ inputs })),
  };
}
