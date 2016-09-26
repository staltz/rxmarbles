import Cycle from '@cycle/rx-run';
import Rx from 'rx';
import {makeDOMDriver, h} from '@cycle/dom';
import {
  SandboxComponent,
  DiagramComponent,
  MarbleComponent,
  DiagramCompletionComponent 
} from './lib';

let SandboxPrototype = Object.create(HTMLElement.prototype);

SandboxPrototype.createdCallback = function createdCallback() {
  let key = this.attributes.key.value;

  function main() {
    return {
      DOM: Rx.Observable.just(
        h('div', {}, [h('x-sandbox', {route: key, key: 1})])
      )
    };
  }
  Cycle.run(main, {
    DOM: makeDOMDriver(this, {
      'x-marble': MarbleComponent,
      'x-diagram-completion': DiagramCompletionComponent,
      'x-diagram': DiagramComponent,
      'x-sandbox': SandboxComponent
    })
  });
};

var XRxMarbles = document.registerElement('rx-marbles', {
  prototype: SandboxPrototype
});
