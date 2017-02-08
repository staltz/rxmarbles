import { run } from '@cycle/rxjs-run';
import { div, makeDOMDriver } from '@cycle/dom';
import { Observable } from 'rxjs';
import { merge } from 'ramda';

import { renderSvgDropshadow } from './styles/utils'
import { Sandbox } from './sandbox/sandbox';

import { renderOperatorsMenu } from './operators-menu';
import { appModel } from './app-model';

function renderContent(sandboxDOM) {
  const flex = { display: 'flex' };
  const flex1 = { flex: '1' };

  return div({ style: flex }, [
    div({ style: { flex: '0 0 0 200px'} }, [renderOperatorsMenu()]),
    div({ style: flex1 }, [sandboxDOM]),
  ]);
}

function main(sources) {
  const route$ = appModel();
  const sandbox = Sandbox(sources);

  const sinks = {
    DOM: sandbox.DOM
      .map((sandboxDOM) =>
        div([
          renderSvgDropshadow(),
          renderContent(sandboxDOM),
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
