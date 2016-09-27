import diagramModel from './diagram-model';
import diagramView from './diagram-view';
import diagramIntent from './diagram-intent';

function DiagramComponent({DOM, props}) {
  let intent = diagramIntent(DOM);
  let model = diagramModel(props, intent);
  let view = diagramView({ DOM, model, props });

  return {
    DOM: view.vtree$,
    data$: model.newData$,
  };
}

module.exports = DiagramComponent;
