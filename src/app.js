/*
 * App entry-point.
 */
var Package = require('package.json');
var binder = require('rxmarbles/binder');
var Sandbox = require('rxmarbles/views/sandbox');
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
var OperatorsMenuView = require('rxmarbles/views/operators-menu');
var OperatorsMenuInterpreter = require('rxmarbles/interpreters/operators-menu');
var DOMDelegator = require('dom-delegator');
var Utils = require('rxmarbles/views/utils');

var domDelegator = DOMDelegator();

var sandboxContainer = document.querySelector(".js-sandboxContainer");
sandboxContainer.innerHTML = "";
sandboxContainer.appendChild(Sandbox.render());

binder(OperatorsMenuModel, OperatorsMenuView, OperatorsMenuInterpreter);
// binder(SandboxModel, SandboxView, SandboxInterpreter);

Utils.renderVTreeStream(OperatorsMenuView.vtree$, ".js-operatorsMenuContainer");

var versionElement = document.querySelector("a.js-appVersion");
versionElement.textContent = "v" + Package.version;
versionElement.href = "https://github.com/staltz/rxmarbles/releases/tag/v" + Package.version;

var rxVersion = Package.dependencies.rx.replace(/(~|\^|\.\+)*/g, "");
var rxElement = document.querySelector("a.js-rxjsVersion");
rxElement.textContent = "RxJS v" + rxVersion;
rxElement.href = "https://github.com/Reactive-Extensions/RxJS/tree/v" + rxVersion;
