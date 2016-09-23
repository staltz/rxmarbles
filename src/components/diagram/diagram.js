import diagramModel from './diagram-model';
import diagramView from './diagram-view';
import diagramIntent from './diagram-intent';

function DiagramComponent({DOM, props}) {
  let intent = diagramIntent(DOM);
  let model = diagramModel(props, intent);
  let view = diagramView(model);

  return {
    DOM: view.vtree$,
    events: {
      newdata: model.newData$
    }
  };
}

module.exports = DiagramComponent;
