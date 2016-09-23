import Cycle from '@cycle/rx-run'
import {makeDOMDriver} from '@cycle/dom';
import appModel from './app-model';
import appView from './app-view';
import operatorsMenuLinkComponent from '~components/operators-menu-link';
import operatorsMenuComponent from '~components/operators-menu';
import sandboxComponent from '~components/sandbox/sandbox';
import diagramComponent from '~components/diagram/diagram';
import marbleComponent from '~components/marble';
import diagramCompletionComponent from '~components/diagram-completion';

function main() {
  return {
    DOM: appView(appModel())
  };
}

export {
  main,
  diagramComponent, 
  diagramCompletionComponent,
  marbleComponent,
  sandboxComponent
};

require.main === module &&
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
