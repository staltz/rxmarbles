import { div } from '@cycle/dom';
import { Observable } from 'rxjs';
import { merge, prop } from 'ramda';

import { Timeline } from './timeline/timeline';

import { createOutputStream$ } from './sandbox-output';
import { utilityExamples } from './data/utility-examples';

export function Sandbox(sources) {
  const example = utilityExamples.delay;
  const inputsStore$ = sources.store.map(prop('inputs'));
  const outputStore$ = createOutputStream$(inputsStore$, example);

  const inputsTimelineSources = merge(sources, { store: inputsStore$ });
  const outputTimelineSources = merge(sources, { store: outputStore$ });

  const inputsTimeline = Timeline(inputsTimelineSources); 
  const outputTimeline = Timeline(outputTimelineSources); 

  const vtree$ = Observable
    .combineLatest(inputsTimeline.DOM, outputTimeline.DOM)
    .map(([inputsDOM, outputDOM]) =>
      div([
        inputsDOM,
        outputDOM,
      ]),
    );

  return {
    DOM: vtree$,
    data: inputsTimeline.data.map((inputs) => ({ inputs })),
  };
}
