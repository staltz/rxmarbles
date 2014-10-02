/*
 * Util functions for rendering to the DOM.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var VDOM = {
  createElement: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
};

function getDxDragStream(element) {
  return Rx.Observable.fromEvent(element, "mousedown")
    .map(function() {
      var moveStream = Rx.Observable.fromEvent(document, "mousemove");
      var upStream = Rx.Observable.fromEvent(document, "mouseup");
      var dxStream = moveStream
        .map(function(ev) {
          ev.stopPropagation;
          ev.preventDefault();
          return ev.pageX;
        })
        .windowWithCount(2, 1)
        .flatMap(function(result) { return result.toArray(); })
        .map(function(array) { return array[1] - array[0]; });
      return dxStream.takeUntil(upStream);
    })
    .concatAll();
};

function getInteractiveLeftPosStream(element, initialPos) {
  return getDxDragStream(element)
    .scan(initialPos, function(acc, dx) {
      var pxToPercentage = 1;
      try {
        pxToPercentage = 100.0 / element.parentElement.clientWidth;
      } catch (err) {
        console.warn(err);
      }
      return acc + (dx * pxToPercentage);
    })
    .map(function(pos) {
      if (pos < 0) { return 0; }
      if (pos > 100) { return 100; }
      return pos;
    })
    .map(Math.round)
    .startWith(initialPos)
    .distinctUntilChanged();
};

function renderVTreeStream(vtree$, containerSelector) {
  // Find and prepare the container
  var container = document.querySelector(containerSelector);
  if (container === null) {
    console.error("Couldn't render into unknown '" + containerSelector + "'");
    return false;
  }
  container.innerHTML = "";
  // Make the DOM node bound to the VDOM node
  var rootNode = document.createElement("div");
  container.appendChild(rootNode);
  vtree$.startWith(h())
    .bufferWithCount(2, 1)
    .subscribe(function(buffer) {
      var oldVTree = buffer[0];
      var newVTree = buffer[1];
      rootNode = VDOM.patch(rootNode, VDOM.diff(oldVTree, newVTree));
    });
  return true;
};

function renderObservableDOMElement(elementStream) {
  var wrapper = document.createElement("div");
  elementStream.subscribe(function(thing) {
    wrapper.innerHTML = "";
    if (Array.isArray(thing)) {
      for (i = 0; i < thing.length; i++) {
        wrapper.appendChild(thing[i]);
      }
    } else if (thing instanceof Element) {
      wrapper.appendChild(thing);
    }
  });
  return wrapper;
};

module.exports = {
  renderVTreeStream: renderVTreeStream,
  renderObservableDOMElement: renderObservableDOMElement,
  getInteractiveLeftPosStream: getInteractiveLeftPosStream
};
