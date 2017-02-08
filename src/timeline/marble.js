import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { merge, values } from 'ramda';

import { dropshadow } from '../styles/utils';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';

import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'marble';

function color(id) {
  return values(COLORS)[id];
}

function view(sources, value$, isHighlighted$) {
  return Observable.combineLatest(
    sources.itemId, sources.content, value$, isHighlighted$)
    .map(([itemId, content, value, isHighlighted]) =>
      svg.g({
        attrs: { class: ELEMENT_CLASS, transform: `translate(${value}, 5)` },
        style: { cursor: 'ew-resize' },
      }, [
        svg.circle({
          attrs: { r: 2.8 },
          style: merge({
            fill: color(itemId),
            stroke: 'black',
            strokeWidth: 0.4,
          }, isHighlighted ? dropshadow : {}),
        }),
        svg.text({
          attrs: { 'text-anchor': 'middle', 'alignment-baseline': 'middle' },
          style: { fontFamily: FONTS.base, fontSize: 2.5, userSelect: 'none' },
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
