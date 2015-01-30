var Cycle = require('cyclejs');
var AppModel = require('rxmarbles/app-model');
var AppView = require('rxmarbles/app-view');
var Renderer = Cycle.createRenderer('.js-appContainer');
var OperatorsMenuComponent = require('rxmarbles/components/operators-menu');
var SandboxComponent = require('rxmarbles/components/sandbox/sandbox');
var DiagramComponent = require('rxmarbles/components/diagram');

Cycle.registerCustomElement('x-operators-menu', OperatorsMenuComponent);
Cycle.registerCustomElement('x-sandbox', SandboxComponent);
Cycle.registerCustomElement('x-diagram', DiagramComponent);

Renderer.inject(AppView);
AppView.inject(AppModel);
