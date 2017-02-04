import { run } from '@cycle/rxjs-run';
import { div, makeDOMDriver } from '@cycle/dom';

import { renderSvgDropshadow } from './styles/utils'
import { Sandbox } from './sandbox';

function main(sources) {
  const sandbox = Sandbox(sources);

  const sinks = {
    DOM: sandbox.DOM
      .map((sandboxDOM) =>
        div([
          renderSvgDropshadow(),
          sandboxDOM,
        ]),
      ),
    store: sandbox.data,
  };

  return sinks;
}

// Note: drivers use xstream 
function dummyDriver(initialValue) {
  return (value$) => value$.startWith(initialValue);
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  store: dummyDriver({}),
});
