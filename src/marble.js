import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { merge } from 'ramda';

import { dropshadow } from './styles/utils';
import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'marble';

function view(props$, value$, isHighlighted$) {
  return Observable.combineLatest(value$, isHighlighted$)
    .map(([value, isHighlighted]) =>
      svg.circle({
        attrs: { class: ELEMENT_CLASS, r: 3, cx: value, cy: 5 },
        style: merge({
          fill: 'orange',
          stroke: 'black',
          strokeWidth: 0.5,
          cursor: 'ew-resize',
        }, isHighlighted ? dropshadow : {}),
      }),
    );
}

function OriginalMarble(sources) {
  return timelineItem(ELEMENT_CLASS, view, sources);
}

export function Marble(sources) {
  return isolate(OriginalMarble)(sources);
}
