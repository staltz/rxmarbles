import { run } from '@cycle/rxjs-run';
import { div, makeDOMDriver } from '@cycle/dom';

import { renderSvgDropshadow } from './styles/utils'
import { Timeline } from './timeline';

function main(sources) {
  const timeline = Timeline(sources);

  const sinks = {
    DOM: timeline.DOM
      .map((timelineDOM) =>
        div([
          renderSvgDropshadow(),
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
    marbles: [
      { time: 15, content: 'A', id: 1, _id: 1 },
      { time: 30, content: 'B', id: 2, _id: 2 },
      { time: 40, content: 'C', id: 3, _id: 3 },
    ],
    endMarker: { time: 80 },
  }),
});
