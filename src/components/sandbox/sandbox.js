import Cycle from 'cyclejs';
import Examples from 'rxmarbles/data/examples';
import {prepareInputDiagram, augmentWithExampleKey, makeNewInputDiagramsData$}
  from 'rxmarbles/components/sandbox/sandbox-input';
import {getOutputDiagram$} from 'rxmarbles/components/sandbox/sandbox-output';
import Immutable from 'immutable';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import {mergeStyles, elevation1Style, elevation2Style, elevation2Before, elevation2After}
  from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

let SandboxComponentModel = Cycle.createModel((Properties, Intent) => {
  let isTruthy = (x => !!x);

  let example$ = Properties.get('route$')
    .filter(isTruthy)
    .map(key => Immutable.Map(Examples[key]).set('key', key));

  let inputDiagrams$ = example$
    .map(example => Immutable.Map({
      'diagrams': example.get('inputs')
        .map(prepareInputDiagram)
        .map(diag => augmentWithExampleKey(diag, example.get('key')))
    }));

  let newInputDiagrams$ = makeNewInputDiagramsData$(
    Intent.get('changeInputDiagram$'), inputDiagrams$
  );

  let allInputDiagrams$ = inputDiagrams$.merge(newInputDiagrams$);

  return {
    inputDiagrams$: inputDiagrams$,
    operatorLabel$: example$.map(example => example.get('label')),
    outputDiagram$: getOutputDiagram$(example$, allInputDiagrams$),
    width$: Properties.get('width$').startWith('100%')
  };
});

let SandboxComponentView = Cycle.createView(Model => {
  function vrenderOperatorLabel(label) {
    let fontSize = (label.length >= 45) ? 1.3 : (label.length >= 30) ? 1.5 : 2;
    let style = {
      fontFamily: Fonts.fontCode,
      fontWeight: '400',
      fontSize: `${fontSize}rem`
    };
    return h('span', {style}, label);
  }

  function vrenderOperator(label) {
    let style = mergeStyles({
      border: '1px solid rgba(0,0,0,0.06)',
      padding: Dimens.spaceMedium,
      textAlign: 'center'},
      elevation2Style
    );
    return h('div', {style}, [
      elevation2Before,
      vrenderOperatorLabel(label),
      elevation2After
    ]);
  }

  function getSandboxStyle(width) {
    return mergeStyles({
      background: Colors.white,
      width: width,
      borderRadius: '2px'},
      elevation1Style
    );
  }

  return {vtree$: Rx.Observable.combineLatest(
    Model.get('inputDiagrams$'),
    Model.get('operatorLabel$'),
    Model.get('outputDiagram$'),
    Model.get('width$'),
    (inputDiagrams, operatorLabel, outputDiagram, width) =>
      h('div', {style: getSandboxStyle(width)}, [
        inputDiagrams.get('diagrams').map(diagram =>
          h('x-diagram', {
            data: diagram,
            interactive: true,
            onnewdata: 'diagramNewData$'
          })
        ),
        vrenderOperator(operatorLabel),
        h('x-diagram', {data: outputDiagram, interactive: false})
      ])
    )
  };
});

let SandboxComponentIntent = Cycle.createIntent(View => ({
  changeInputDiagram$: View.get('diagramNewData$')
}));

let SandboxComponent = Cycle.createView(Attributes => {
  let Model = SandboxComponentModel.clone();
  let View = SandboxComponentView.clone();
  let Intent = SandboxComponentIntent.clone();

  Intent.inject(View).inject(Model).inject(Attributes, Intent);

  return {
    vtree$: View.get('vtree$')
  };
});

module.exports = SandboxComponent;
