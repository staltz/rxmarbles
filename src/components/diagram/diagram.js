import Cycle from 'cyclejs';
import DiagramComponentModel from 'rxmarbles/components/diagram/diagram-model';
import DiagramComponentView from 'rxmarbles/components/diagram/diagram-view';
import DiagramComponentIntent from 'rxmarbles/components/diagram/diagram-intent';

function DiagramComponent(User, Properties) {
  let Model = DiagramComponentModel.clone();
  let View = DiagramComponentView.clone();
  let Intent = DiagramComponentIntent.clone();

  User.inject(View).inject(Model).inject(Properties, Intent)[1].inject(User);

  return {
    newdata$: Model.get('newData$')
  };
}

module.exports = DiagramComponent;
