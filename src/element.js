import Cycle from '@cycle/core';
import {makeDOMDriver, h} from '@cycle/dom';
import DiagramComponent from 'rxmarbles/components/diagram/diagram';
import SandboxComponent from 'rxmarbles/components/sandbox/sandbox';
import MarbleComponent from 'rxmarbles/components/marble';
import DiagramCompletionComponent from 'rxmarbles/components/diagram-completion';

let SandboxPrototype = Object.create(HTMLElement.prototype);

SandboxPrototype.createdCallback = function createdCallback() {
  let key = this.attributes.key.value;

  function main() {
    return {
      DOM: Cycle.Rx.Observable.just(
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
