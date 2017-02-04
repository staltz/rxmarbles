import { div } from '@cycle/dom';
import { Observable } from 'rxjs';
import { merge } from 'ramda';

import { Timeline } from './timeline/timeline';
import { utilityExamples } from './data/utility-examples';

import { createMarbleStreams$ } from './sandbox-output';

const example = utilityExamples.delay;

const { inputs: inputMarbles$, output: outputMarbles$ }
  = createMarbleStreams$(example);

function createTimelineStore$(marbles$) {
  return marbles$.map(marbles => ({ marbles, endMarker: { time: 80 } }));
}

export function Sandbox(sources) {
  const inputsStoreSource$ = sources.store
    .switchMap(
      (store) => store.inputs
        ? Observable.of(store.inputs)
        : createTimelineStore$(inputMarbles$)
    );
  const outputStoreSource$ = sources.store
    .switchMap(
      (store) => store.output
        ? Observable.of(store.output)
        : createTimelineStore$(outputMarbles$)
    );

  const inputsTimelineSources = merge(sources, { store: inputsStoreSource$ });
  const outputTimelineSources = merge(sources, { store: outputStoreSource$ });

  const inputsTimeline = Timeline(inputsTimelineSources); 
  const outputTimeline = Timeline(outputTimelineSources); 

  const vtree$ = Observable
    .combineLatest(inputsTimeline.DOM, outputTimeline.DOM)
    .map(([inputsDOM, outputsDOM]) =>
      div([
        inputsDOM,
        outputsDOM,
      ]),
    );

  const data$ = Observable
    .combineLatest(inputsTimeline.data, outputTimeline.data)
    .map(([inputs, output]) => ({ inputs, output }));

  return {
    DOM: vtree$,
    data: data$,
  };
}
