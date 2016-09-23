import Cycle from '@cycle/rx-run'
import {makeDOMDriver} from '@cycle/dom';
import appModel from './app-model';
import appView from './app-view';
import operatorsMenuLinkComponent from '~components/operators-menu-link';
import operatorsMenuComponent from '~components/operators-menu';
import {
  sandboxComponent,
  diagramComponent,
  marbleComponent,
  diagramCompletionComponent 
} from './lib';

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
