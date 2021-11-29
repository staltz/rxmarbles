import run from '@cycle/rxjs-run';
import { Observable } from 'rxjs/Observable';
import { makeDOMDriver, h } from '@cycle/dom';
import { Sandbox } from './components/sandbox/sandbox';
import { merge } from 'ramda';

class SandboxElement extends HTMLElement {
  connectedCallback() {
    let key = this.attributes.key.value;
    const initialStore = { route: key, inputs: undefined };
    function main( sources ) {
      const sandbox = Sandbox( sources );
      const sinks = {
        DOM: sandbox.DOM,
        store: sandbox.data.scan(merge, initialStore).startWith( initialStore ),
      };
      return sinks;
    }

    run(main, {
      DOM: makeDOMDriver(this),
      store: sources => sources.startWith( initialStore ),
    });
  }
}

customElements.define( 'rx-marbles', SandboxElement );