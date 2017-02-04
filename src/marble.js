import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { merge } from 'ramda';

import { dropshadow } from './styles/utils';
import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'marble';

function color(id) {
  return {
    1: 'red',
    2: 'orange',
    3: 'blue',
  }[id];
}

function view(sources, value$, isHighlighted$) {
  return Observable.combineLatest(
    sources.id, sources.content, value$, isHighlighted$)
    .map(([id, content, value, isHighlighted]) =>
      svg.g({
        attrs: { class: ELEMENT_CLASS, transform: `translate(${value}, 5)` },
        style: { cursor: 'ew-resize' },
      }, [
        svg.circle({
          attrs: { r: 3 },
          style: merge({
            fill: color(id),
            stroke: 'black',
            strokeWidth: 0.4,
          }, isHighlighted ? dropshadow : {}),
        }),
        svg.text({
          attrs: { 'text-anchor': 'middle', 'alignment-baseline': 'middle' },
          style: { fontSize: 3.5, userSelect: 'none' }
        }, [content]),
      ]),
    );
}

function OriginalMarble(sources) {
  const { DOM, time } = timelineItem(ELEMENT_CLASS, view, sources);

  const data$ = Observable.combineLatest(time, sources.id)
    .map(([time, id]) => ({ time, id }));

  return { DOM, data: data$ };
}

export function Marble(sources) {
  return isolate(OriginalMarble)(sources);
}
