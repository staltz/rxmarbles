import { run } from '@cycle/rxjs-run';
import { div, makeDOMDriver } from '@cycle/dom';
import { Observable } from 'rxjs';
import { merge } from 'ramda';

import { renderSvgDropshadow } from './styles/utils'
import { Sandbox } from './sandbox/sandbox';

import { examples } from './data';
import { appModel } from './app-model';

function main(sources) {
  const route$ = appModel();
  const sandbox = Sandbox(sources);

  const sinks = {
    DOM: sandbox.DOM
      .map((sandboxDOM) =>
        div([
          renderSvgDropshadow(),
          sandboxDOM,
        ]),
      ),
    store: Observable.merge(route$, sandbox.data)
      .scan(merge, {}),
  };

  return sinks;
}

// Note: drivers use xstream 
function dummyDriver(initialValue) {
  return (value$) => value$.remember().startWith(initialValue);
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  store: dummyDriver({}),
});
