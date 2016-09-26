import Cycle from '@cycle/rx-run'
import {makeDOMDriver} from '@cycle/dom';
import appModel from './app-model';
import appView from './app-view';
import OperatorsMenuLinkComponent from '~components/operators-menu-link';
import OperatorsMenuComponent from '~components/operators-menu';
import {
  SandboxComponent,
  DiagramComponent,
  MarbleComponent,
  DiagramCompletionComponent 
} from './lib';
import debugHook from './rx-debug';

debugHook();

function main() {
  return {
    DOM: appView(appModel().debug("appModel"))
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('.js-appContainer', {
    'x-operators-menu-link': OperatorsMenuLinkComponent,
    'x-operators-menu': OperatorsMenuComponent,
    'x-sandbox': SandboxComponent,
    'x-marble': MarbleComponent,
    'x-diagram-completion': DiagramCompletionComponent,
    'x-diagram': DiagramComponent
  })
});
