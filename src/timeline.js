import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';

import { Marble } from './marble';
import { EndMarker } from './end-marker';

function OriginalTimeline({ DOM, store }) {
  const marbleProps$ = store.map(({ marbles, endMarker }) => ({
    value: marbles.value,
    minValue: 0,
    maxValue: endMarker.value,
  }));
  const endMarkerProps$ = store.map(({ marbles, endMarker }) => ({
    value: endMarker.value,
    minValue: marbles.value,
    maxValue: 100,
  }));

  const marbleSources = { DOM, props: marbleProps$ };
  const endMarkerSources = { DOM, props: endMarkerProps$ };

  const marble = Marble(marbleSources);
  const endMarker = EndMarker(endMarkerSources);

  const vtree$ = Observable.combineLatest(marble.DOM, endMarker.DOM)
    .map(([marbleDOM, endMarkerDOM]) =>
      svg({
        attrs: { viewBox: '0 0 100 10' },
        style: { width: 300, height: 30, overflow: 'visible' },
      }, [
        svg.line({
          attrs: { x1: 0, x2: 100, y1: 5, y2: 5 },
          style: { stroke: 'black', strokeWidth: 0.5 },
        }),
        endMarkerDOM,
        marbleDOM,
      ])
    );

  const data$ = Observable.combineLatest(marble.data, endMarker.data)
    .map(([marbleValue, endMarkerValue]) => ({
      marbles: { value: marbleValue },
      endMarker: { value: endMarkerValue },
    }));

  return { DOM: vtree$, data: data$ };
}

export function Timeline(sources) {
  return isolate(OriginalTimeline)(sources);
}