import Cycle from 'cyclejs';
import diagramModel from 'rxmarbles/components/diagram/diagram-model';
import diagramView from 'rxmarbles/components/diagram/diagram-view';
import diagramIntent from 'rxmarbles/components/diagram/diagram-intent';

function DiagramComponent(interactions, properties) {
  let intent = diagramIntent(interactions);
  let model = diagramModel(properties, intent);
  let view = diagramView(model);

  return {
    vtree$: view.vtree$,
    newdata$: model.newData$
  };
}

module.exports = DiagramComponent;
