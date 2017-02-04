import { svg } from '@cycle/dom';
import { Collection } from './collection';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { max, prop } from 'ramda';

import { Marble } from './marble';
import { EndMarker } from './end-marker';

function OriginalTimeline({ DOM, store }) {
  const marblesProps$ = store.map(({ endMarker }) => ({
    minValue: 0,
    maxValue: endMarker,
  }));
  const endMarkerProps$ = store.map(({ marbles }) => ({
    minValue: marbles.reduce(max),
    maxValue: 100,
  }));

  const marblesSources = { DOM, props: marblesProps$ };
  const endMarkerSources = {
    DOM,
    props: endMarkerProps$,
    value: store.pluck('endMarker'),
  };

  const marblesState$ = store.pluck('marbles')
    .map(values => values.map((value, id) => ({ value, id }) ));

  const marbles$ = Collection.gather(Marble, marblesSources, marblesState$);
  const marbleDOMs$ = Collection.pluck(marbles$, prop('DOM'));
  const endMarker = EndMarker(endMarkerSources);

  const vtree$ = Observable.combineLatest(marbleDOMs$, endMarker.DOM)
    .map(([marbleDOMs, endMarkerDOM]) =>
      svg({
        attrs: { viewBox: '0 0 100 10' },
        style: { width: 300, height: 30, overflow: 'visible' },
      }, [
        svg.line({
          attrs: { x1: 0, x2: 100, y1: 5, y2: 5 },
          style: { stroke: 'black', strokeWidth: 0.5 },
        }),
        endMarkerDOM,
      ].concat(marbleDOMs))
    );

  const marbleData$ = Collection.pluck(marbles$, prop('data'));
  const data$ = Observable.combineLatest(marbleData$, endMarker.data)
    .map(([marbleValues, endMarkerValue]) => ({
      marbles: marbleValues,
      endMarker: endMarkerValue,
    }));

  return { DOM: vtree$, data: data$ };
}

export function Timeline(sources) {
  return isolate(OriginalTimeline)(sources);
}
