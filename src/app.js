var Cycle = require('cyclejs');
var AppModel = require('rxmarbles/app-model');
var AppView = require('rxmarbles/app-view');
var Renderer = Cycle.createRenderer('.js-appContainer');
var OperatorsMenuLinkComponent = require('rxmarbles/components/operators-menu-link');
var OperatorsMenuComponent = require('rxmarbles/components/operators-menu');
var SandboxComponent = require('rxmarbles/components/sandbox/sandbox');
var DiagramComponent = require('rxmarbles/components/diagram/diagram');
var MarbleComponent = require('rxmarbles/components/marble');
var DiagramCompletionComponent = require('rxmarbles/components/diagram-completion');

Cycle.registerCustomElement('x-operators-menu-link', OperatorsMenuLinkComponent);
Cycle.registerCustomElement('x-operators-menu', OperatorsMenuComponent);
Cycle.registerCustomElement('x-sandbox', SandboxComponent);
Cycle.registerCustomElement('x-marble', MarbleComponent);
Cycle.registerCustomElement('x-diagram-completion', DiagramCompletionComponent);
Cycle.registerCustomElement('x-diagram', DiagramComponent);

Renderer.inject(AppView);
AppView.inject(AppModel);
