/*
 * Renderer component.
 * Subscribes to vtree observables of all view components
 * and renders them as real DOM elements to the browser.
 */
var h = require('virtual-hyperscript');
var VDOM = {
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
};
var DOMDelegator = require('dom-delegator');
var OperatorsMenuView = require('rxmarbles/views/operators-menu');
var SandboxView = require('rxmarbles/views/sandbox');
var Package = require('package.json');

var domDelegator;

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

function renderAppVersionOnce() {
  var versionElement = document.querySelector("a.js-appVersion");
  versionElement.textContent = "v" + Package.version;
  versionElement.href = "https://github.com/staltz/rxmarbles/releases/tag/v" + Package.version;
}

function renderRxVersionOnce() {
  var rxVersion = Package.dependencies.rx.replace(/(~|\^|\.\+)*/g, "");
  var rxElement = document.querySelector("a.js-rxjsVersion");
  rxElement.textContent = "RxJS v" + rxVersion;
  rxElement.href = "https://github.com/Reactive-Extensions/RxJS/tree/v" + rxVersion;
}

function init() {
  domDelegator = DOMDelegator();
  renderVTreeStream(OperatorsMenuView.vtree$, ".js-operatorsMenuContainer");
  renderVTreeStream(SandboxView.vtree$, ".js-sandboxContainer");
  renderAppVersionOnce();
  renderRxVersionOnce();
}

module.exports = {
  init: init
};
