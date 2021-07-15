import { svg, div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { apply, flip, map, max, merge, path, prop, sortBy, zip } from 'ramda';

import { Collection } from '../../collection';
import { DIMENS } from '../../styles';

import { MARBLE_SIZE, STROKE_WIDTH } from './timeline-constants';
import { Marble } from './marble';
import { EndMarker } from './end-marker';

const timelineStyle = { padding: `${DIMENS.spaceSmall} ${DIMENS.spaceMedium}` };

function sortMarbleDoms$(marbles$) {
  const doms$ = Collection.pluck(marbles$, prop('DOM'));
  const dataList$ = Collection.pluck(marbles$, prop('data'));

  return Observable.combineLatest(doms$, dataList$, zip)
    .map(sortBy(path([1, 'time'])))
    .map(map(prop(0)));
}

function OriginalTimeline(sources) {
  const {
    DOM,
    marbles: marblesState$,
    end: end$,
    interactive: interactive$
  } = sources;
  const marblesProps$ = end$
    .map((end) => ({
      minTime: 0,
      maxTime: end.time,
    }));
  const endMarkerProps$ = Observable.combineLatest(marblesState$, end$)
    .map(([marbles, end]) => {
      const maxMarbleTime = marbles.map(prop('time')).reduce(max, 0);
      return {
        isTall: end.time <= (maxMarbleTime + MARBLE_SIZE),
        minTime: maxMarbleTime,
        maxTime: 100,
      };
    });

  const marblesSources = {
    DOM,
    props: marblesProps$,
    isDraggable: interactive$
  };
  const endMarkerSources = {
    DOM,
    props: endMarkerProps$,
    time: end$.pluck('time'),
    isDraggable: interactive$,
  };

  const marbles$ = Collection.gather(
    Marble, marblesSources, marblesState$, 'itemId');
  const marbleDOMs$ = sortMarbleDoms$(marbles$);
  const endMarker = EndMarker(endMarkerSources);

  const vtree$ = Observable.combineLatest(marbleDOMs$, endMarker.DOM)
    .map(([marbleDOMs, endMarkerDOM]) =>
      div({ style: timelineStyle }, [
        svg({
          attrs: { viewBox: '0 0 7 10' },
          style: { width: '48px', height: '68px', overflow: 'visible' },
        }, [
          svg.line({
            attrs: { x1: '0', y1: '5', x2: '112', y2: '5' },
            style: { stroke: 'black', strokeWidth: `${STROKE_WIDTH}` },
          }),
          svg.polygon({
            attrs: { points: '111.7,6.1 111.7,3.9 114,5' },
          }),
        ]),
        svg({
          attrs: { viewBox: '0 0 100 10' },
          style: { width: '680px', height: '68px', overflow: 'visible' },
        }, [
          endMarkerDOM,
          ...marbleDOMs,
        ]),
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
