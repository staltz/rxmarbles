import Cycle from 'cyclejs';
import Examples from 'rxmarbles/data/examples';
import {prepareInputDiagram, augmentWithExampleKey}
  from 'rxmarbles/components/sandbox/sandbox-input';
import {getOutputDiagram$} from 'rxmarbles/components/sandbox/sandbox-output';
import Immutable from 'immutable';
let Rx = Cycle.Rx;
let h = Cycle.h;

let isTruthy = (x => !!x);

function vrenderOperatorLabel(label) {
  let attrs = (label.length > 20) ? {style: {"font-size": "1.5rem"}} : {};
  return h("span.operator-box-label", attrs, label);
}

function vrenderOperator(label) {
  return h("div.operator-box", [vrenderOperatorLabel(label)]);
}

function makeNewInputDiagramsData$(changeInputDiagram$, inputs$) {
  return Rx.Observable.merge(changeInputDiagram$, inputs$)
    .scan((prev, curr) => {
      let currentIsDiagramData = !!curr && !!curr.get('notifications');
      if (currentIsDiagramData) {
        if (!prev || !prev.get || !Array.isArray(prev.get('diagrams'))) {
          console.warn('Inconsistency in SandboxComponent.makeNewInputDiagramsData$()');
        }
        let inputs = prev;
        let newDiagramData = curr;
        return inputs.set('diagrams',
          inputs.get('diagrams').map(diagramData => {
            if (diagramData.get('id') === newDiagramData.get('id')) {
              return newDiagramData;
            } else {
              return diagramData;
            }
          })
        ).set('isInitialData', false);
      } else {
        return curr.set('isInitialData', true);
      }
    })
    .filter(x => !x.get('isInitialData')) // only allow new diagram data
}

let SandboxComponent = Cycle.createView(Attributes => {
  let Model = Cycle.createModel((Attributes, Intent) => {
    let example$ = Attributes.get('route$')
      .filter(isTruthy)
      .map(key => Immutable.Map(Examples[key]).set('key', key));
    let inputDiagrams$ = example$
      .map(example => Immutable.Map({
        'diagrams': example.get('inputs')
          .map(prepareInputDiagram)
          .map(diag => augmentWithExampleKey(diag, example.get('key')))
      }));
    let newInputDiagrams$ = makeNewInputDiagramsData$(
      Intent.get('changeInputDiagram$'),
      inputDiagrams$
    );
    let allInputDiagrams$ = inputDiagrams$.merge(newInputDiagrams$);

    return {
      inputDiagrams$: inputDiagrams$,
      operatorLabel$: example$.map(example => example.get('label')),
      outputDiagram$: getOutputDiagram$(example$, allInputDiagrams$)
    };
  });

  let View = Cycle.createView(Model => ({
    vtree$: Rx.Observable.combineLatest(
      Model.get('inputDiagrams$'),
      Model.get('operatorLabel$'),
      Model.get('outputDiagram$'),
      (inputDiagrams, operatorLabel, outputDiagram) =>
        h('div.sandbox', [
          inputDiagrams.get('diagrams').map(diagram =>
            h('x-diagram', {
              attributes: {data: diagram, interactive: true},
              onnewdata: 'diagramNewData$'
            })
          ),
          vrenderOperator(operatorLabel),
          h('x-diagram', {attributes: {data: outputDiagram, interactive: false}})
        ])
    )
  }));

  let Intent = Cycle.createIntent(View => ({
    changeInputDiagram$: View.get('diagramNewData$')
  }));

  Intent.inject(View).inject(Model).inject(Attributes, Intent);

  return {
    vtree$: View.get('vtree$')
  };
});

module.exports = SandboxComponent;
