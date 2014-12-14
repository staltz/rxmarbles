/*
 * App entry-point.
 */
var binder = require('rxmarbles/binder');
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
var OperatorsMenuView = require('rxmarbles/views/operators-menu');
var OperatorsMenuIntent = require('rxmarbles/intents/operators-menu');
var SandboxModel = require('rxmarbles/models/sandbox');
var SandboxView = require('rxmarbles/views/sandbox');
var SandboxIntent = require('rxmarbles/intents/sandbox');
var renderer = require('rxmarbles/renderer');

binder(OperatorsMenuModel, OperatorsMenuView, OperatorsMenuIntent);
binder(SandboxModel, SandboxView, SandboxIntent);
renderer.init();
