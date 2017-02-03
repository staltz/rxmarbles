import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'marble';

function view(props$, value$) {
  return value$
    .map((value) =>
      svg.circle({
        attrs: { class: ELEMENT_CLASS, r: 3, cx: value, cy: 5 },
        style: { fill: 'orange', stroke: 'black', strokeWidth: 0.5 },
      }),
    );
}

function OriginalMarble(sources) {
  return timelineItem(ELEMENT_CLASS, view, sources);
}

export function Marble(sources) {
  return isolate(OriginalMarble)(sources);
}
