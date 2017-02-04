import { run } from '@cycle/rxjs-run';
import { div, label, makeDOMDriver } from '@cycle/dom';
import { Observable } from 'rxjs';

import { renderSvgDropshadow } from './styles/utils'
import { Timeline } from './timeline';

function main(sources) {
  const timeline = Timeline(sources);

  const sinks = {
    DOM: timeline.DOM
      .map((timelineDOM) =>
        div([
          renderSvgDropshadow(),
          label('Helloz'),
          timelineDOM,
        ]),
      ),
    store: timeline.data,
  };

  return sinks;
}

function dummyDriver(initialValue) {
  return (value$) => value$.startWith(initialValue);
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  store: dummyDriver({
    marbles: [15, 30, 40],
    endMarker: 80,
  }),
});
