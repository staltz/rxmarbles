import { run } from '@cycle/rxjs-run';
import { div, makeDOMDriver } from '@cycle/dom';

import { renderSvgDropshadow } from './styles/utils'
import { Sandbox } from './sandbox';
import { inputsToMarbles } from './sandbox-utils';
import { utilityExamples } from './data/utility-examples';

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

const example = utilityExamples.delay;
const inputMarbles = inputsToMarbles(example.inputs)[0];

// Note: drivers use xstream 
function dummyDriver(initialValue) {
  return (value$) => value$.startWith(initialValue);
}

run(main, {
  DOM: makeDOMDriver('#app-container'),
  store: dummyDriver({
    inputs: {
      marbles: inputMarbles,
      end: { time: 90 },
    },
  }),
});
