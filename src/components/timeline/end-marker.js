import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';

import { STROKE_WIDTH } from './timeline-constants';
import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'end-marker';
const baseHeight = 1.8;
const tallHeight = 3.2;

function view(sources, value$) {
  return Observable.combineLatest(sources.props, value$)
    .map(([{isTall}, value]) => {
      const height = isTall ? tallHeight : baseHeight;
      return svg.line({
        attrs: {
          class: ELEMENT_CLASS,
          x1: value, x2: value,
          y1: 5 - height, y2: 5 + height,
        },
        style: {
          stroke: 'black',
          strokeWidth: STROKE_WIDTH,
          cursor: 'ew-resize'
        },
      });
    });
}

function OriginalEndMarker(sources) {
  return timelineItem(ELEMENT_CLASS, view, sources);
}

export function EndMarker(sources) {
  return isolate(OriginalEndMarker)(sources);
}
