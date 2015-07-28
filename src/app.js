import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import appModel from 'rxmarbles/app-model';
import appView from 'rxmarbles/app-view';
import operatorsMenuLinkComponent from 'rxmarbles/components/operators-menu-link';
import operatorsMenuComponent from 'rxmarbles/components/operators-menu';
import sandboxComponent from 'rxmarbles/components/sandbox/sandbox';
import diagramComponent from 'rxmarbles/components/diagram/diagram';
import marbleComponent from 'rxmarbles/components/marble';
import diagramCompletionComponent from 'rxmarbles/components/diagram-completion';

function main() {
  return {
    DOM: appView(appModel())
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('.js-appContainer', {
    'x-operators-menu-link': operatorsMenuLinkComponent,
    'x-operators-menu': operatorsMenuComponent,
    'x-sandbox': sandboxComponent,
    'x-marble': marbleComponent,
    'x-diagram-completion': diagramCompletionComponent,
    'x-diagram': diagramComponent
  })
});
