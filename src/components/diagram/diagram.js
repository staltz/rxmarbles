import diagramModel from 'rxmarbles/components/diagram/diagram-model';
import diagramView from 'rxmarbles/components/diagram/diagram-view';
import diagramIntent from 'rxmarbles/components/diagram/diagram-intent';

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
