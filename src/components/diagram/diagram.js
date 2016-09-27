import Rx from 'rx';
import diagramModel from './diagram-model';
import diagramView from './diagram-view';
import diagramIntent from './diagram-intent';
import isolate from '@cycle/isolate';

function DiagramComponent({DOM, props}) {
  let intentSources = {
    DOM: DOM,
    click$: Rx.Observable.defer(() => { return view.click$ })
  }
  let intent = diagramIntent(intentSources);
  let model = diagramModel(props, intent);
  let view = diagramView({ DOM, model, props });

  return {
    DOM: view.vtree$,
    data$: model.newData$,
  };
}

module.exports = sources => isolate(DiagramComponent)(sources);
