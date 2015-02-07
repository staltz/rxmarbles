import Cycle from 'cyclejs';
import DiagramComponentModel from 'rxmarbles/components/diagram/diagram-model';
import DiagramComponentView from 'rxmarbles/components/diagram/diagram-view';
import DiagramComponentIntent from 'rxmarbles/components/diagram/diagram-intent';

module.exports = Cycle.createView(Properties => {
  let Model = DiagramComponentModel.clone();
  let View = DiagramComponentView.clone();
  let Intent = DiagramComponentIntent.clone();

  Intent.inject(View).inject(Model).inject(Properties, Intent);

  return {
    vtree$: View.get('vtree$'),
    newdata$: Model.get('newData$')
  };
});
