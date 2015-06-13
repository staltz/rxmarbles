import Cycle from 'cyclejs';
import DiagramComponent from 'rxmarbles/components/diagram/diagram';
import SandboxComponent from 'rxmarbles/components/sandbox/sandbox';
import MarbleComponent from 'rxmarbles/components/marble';
import DiagramCompletionComponent from 'rxmarbles/components/diagram-completion';
let h = Cycle.h;

let SandboxPrototype = Object.create(HTMLElement.prototype);

SandboxPrototype.createdCallback = function createdCallback() {
  let key = this.attributes.key.value;
  Cycle.registerCustomElement('x-marble', MarbleComponent);
  Cycle.registerCustomElement('x-diagram-completion', DiagramCompletionComponent);
  Cycle.registerCustomElement('x-diagram', DiagramComponent);
  Cycle.registerCustomElement('x-sandbox', SandboxComponent);

  let View = () => Cycle.Rx.Observable.just(h('div', {}, [h('x-sandbox', {route: key, key: 1})]));
  Cycle.applyToDOM(this, View);
  /*
  let User = Cycle.createDOMUser(this);
  let View = Cycle.createView(() =>
      ({ vtree$: Cycle.Rx.Observable.just(h('x-sandbox', {route: key})) })
  );
  User.inject(View);
  */
};

var XRxMarbles = document.registerElement('rx-marbles', {
  prototype: SandboxPrototype
});
