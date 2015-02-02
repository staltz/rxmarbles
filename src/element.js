import Cycle from 'cyclejs';
import DiagramComponent from 'rxmarbles/components/diagram';
import SandboxComponent from 'rxmarbles/components/sandbox/sandbox';
let h = Cycle.h;

let SandboxPrototype = Object.create(HTMLElement.prototype);

SandboxPrototype.createdCallback = function createdCallback() {
  let key = this.attributes.key.value;
  Cycle.registerCustomElement('x-diagram', DiagramComponent);
  Cycle.registerCustomElement('x-sandbox', SandboxComponent);
  let Renderer = Cycle.createRenderer(this);
  let View = Cycle.createView(() =>
    ({ vtree$: Cycle.Rx.Observable.just(h('x-sandbox', {attributes: {route: key}})) })
  );
  Renderer.inject(View);
};

var XRxMarbles = document.registerElement('x-rxmarbles', {
  prototype: SandboxPrototype
});
