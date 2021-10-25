import { run } from '@cycle/rxjs-run';
import { makeDOMDriver } from '@cycle/dom';
import { merge as mergeOperator } from 'rxjs';
import { scan } from 'rxjs/operators';
import { merge } from 'ramda';

import { Sandbox } from './components/sandbox';

import { appModel } from './app-model';
import { appView } from './app-view';


function main(sources) {
  const route$ = appModel();
  const sandbox = Sandbox(sources);

  const sinks = {
    DOM: appView(sandbox.DOM),
    store: mergeOperator(route$, sandbox.data)
      .pipe(
        scan(merge, {})
      ),
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
