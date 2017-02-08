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

function OriginalTimeline({ DOM, marbles: marblesState$, end: end$ }) {
  const marblesProps$ = end$.map(({ time }) => ({
    minTime: 0,
    maxTime: time,
  }));
  const endMarkerProps$ = marblesState$.map(marbles => ({
    minTime: marbles.map(prop('time')).reduce(max, 0),
    maxTime: 100,
  }));

  const marblesSources = { DOM, props: marblesProps$ };
  const endMarkerSources = {
    DOM,
    props: endMarkerProps$,
    time: end$.pluck('time'),
  };

  const marbles$ = Collection.gather(
    Marble, marblesSources, marblesState$, '_itemId');
  const marbleDOMs$ = sortMarbleDoms$(marbles$);
  const endMarker = EndMarker(endMarkerSources);

  const vtree$ = Observable.combineLatest(marbleDOMs$, endMarker.DOM)
    .map(([marbleDOMs, endMarkerDOM]) =>
      svg({
        attrs: { viewBox: '-9 0 110 10' },
        style: { width: 595, height: 50, overflow: 'visible' },
      }, [
        svg.line({
          attrs: { x1: -9, x2: 108, y1: 5, y2: 5 },
          style: { stroke: 'black', strokeWidth: 0.4 },
        }),
        svg.polygon({
          attrs: { points: '107,6.5 107,3.5 110,5' },
        }),
        endMarkerDOM,
        ...marbleDOMs,
      ])
    );

  const marbleData$ = Collection.pluck(marbles$, prop('data'))
    .debounceTime(0)
    .withLatestFrom(marblesState$, zip)
    .map(map(apply(flip(merge))));

  const data$ = Observable.combineLatest(marbleData$, endMarker.time)
    .map(([marbles, endMarkerTime]) => ({
      marbles,
      end: { time: endMarkerTime },
    }));

  return { DOM: vtree$, data: data$ };
}

export function Timeline(sources) {
  return isolate(OriginalTimeline)(sources);
}
