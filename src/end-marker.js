import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'end-marker';

function view(props$, value$) {
  return value$
    .map((value) =>
      svg.line({
        attrs: { class: ELEMENT_CLASS, x1: value, x2: value, y1: 1, y2: 9 },
        style: { stroke: 'black', strokeWidth: 0.5, cursor: 'ew-resize' },
      }),
    );
}

function OriginalEndMarker(sources) {
  return timelineItem(ELEMENT_CLASS, view, sources);
}

export function EndMarker(sources) {
  return isolate(OriginalEndMarker)(sources);
}
