import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { apply, flip, map, max, merge, path, prop, sortBy, zip } from 'ramda';

import { Collection } from '../collection';

import { Marble } from './marble';
import { EndMarker } from './end-marker';

function sortMarbleDoms$(marbles$) {
  const doms$ = Collection.pluck(marbles$, prop('DOM'));
  const dataList$ = Collection.pluck(marbles$, prop('data'));

  return Observable.combineLatest(doms$, dataList$, zip)
    .map(sortBy(path([1, 'time'])))
    .map(map(prop(0)));
}

function OriginalTimeline({ DOM, store }) {
  const marblesProps$ = store.map(({ endMarker }) => ({
    minTime: 0,
    maxTime: endMarker.time,
  }));
  const endMarkerProps$ = store.map(({ marbles }) => ({
    minTime: marbles.map(prop('time')).reduce(max),
    maxTime: 100,
  }));

  const marblesSources = { DOM, props: marblesProps$ };
  const endMarkerSources = {
    DOM,
    props: endMarkerProps$,
    time: store.map(path(['endMarker', 'time'])),
  };

  const marblesState$ = store.pluck('marbles');

  const marbles$ = Collection.gather(
    Marble, marblesSources, marblesState$, '_itemId');
  const marbleDOMs$ = sortMarbleDoms$(marbles$);
  const endMarker = EndMarker(endMarkerSources);

  const vtree$ = Observable.combineLatest(marbleDOMs$, endMarker.DOM)
    .map(([marbleDOMs, endMarkerDOM]) =>
      svg({
        attrs: { viewBox: '0 0 100 10' },
        style: { width: 500, height: 50, overflow: 'visible' },
      }, [
        svg.line({
          attrs: { x1: 0, x2: 100, y1: 5, y2: 5 },
          style: { stroke: 'black', strokeWidth: 0.4 },
        }),
        endMarkerDOM,
      ].concat(marbleDOMs))
    );

  const marbleData$ = Collection.pluck(marbles$, prop('data'))
    .withLatestFrom(marblesState$, zip)
    .map(map(apply(flip(merge))));

  const data$ = Observable.combineLatest(marbleData$, endMarker.time)
    .map(([marbles, endMarkerTime]) => ({
      marbles,
      endMarker: { time: endMarkerTime },
    }));

  return { DOM: vtree$, data: data$ };
}

export function Timeline(sources) {
  return isolate(OriginalTimeline)(sources);
}
