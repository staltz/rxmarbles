var Cycle = require('cyclejs');
var appModel = require('rxmarbles/app-model');
var appView = require('rxmarbles/app-view');
var operatorsMenuLinkComponent = require('rxmarbles/components/operators-menu-link');
var operatorsMenuComponent = require('rxmarbles/components/operators-menu');
var sandboxComponent = require('rxmarbles/components/sandbox/sandbox');
var diagramComponent = require('rxmarbles/components/diagram/diagram');
var marbleComponent = require('rxmarbles/components/marble');
var diagramCompletionComponent = require('rxmarbles/components/diagram-completion');

Cycle.registerCustomElement('x-operators-menu-link', operatorsMenuLinkComponent);
Cycle.registerCustomElement('x-operators-menu', operatorsMenuComponent);
Cycle.registerCustomElement('x-sandbox', sandboxComponent);
Cycle.registerCustomElement('x-marble', marbleComponent);
Cycle.registerCustomElement('x-diagram-completion', diagramCompletionComponent);
Cycle.registerCustomElement('x-diagram', diagramComponent);

Cycle.applyToDOM('.js-appContainer', function app() {
  return appView(appModel());
});
