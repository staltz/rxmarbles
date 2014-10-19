/*
 * App entry-point.
 */
var binder = require('rxmarbles/binder');
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
var OperatorsMenuView = require('rxmarbles/views/operators-menu');
var OperatorsMenuInterpreter = require('rxmarbles/interpreters/operators-menu');
var SandboxModel = require('rxmarbles/models/sandbox');
var SandboxView = require('rxmarbles/views/new-sandbox');
var SandboxInterpreter = require('rxmarbles/interpreters/sandbox');
var DOMDelegator = require('dom-delegator');
var renderer = require('rxmarbles/renderer');

var domDelegator = DOMDelegator();

binder(OperatorsMenuModel, OperatorsMenuView, OperatorsMenuInterpreter);
binder(SandboxModel, SandboxView, SandboxInterpreter);

renderer.init();
