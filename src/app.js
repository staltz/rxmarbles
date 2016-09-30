import { run } from '@cycle/rx-run'
import Rx from 'rx-dom';
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
import hook from '~rx-debug';
hook()

function main(sources) {
  return {
    DOM: appView(sources, appModel())
      .sample(16, Rx.Scheduler.requestAnimationFrame)
  };
}

run(main, { DOM: makeDOMDriver('.js-appContainer') })
