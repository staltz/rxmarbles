import Rx from 'rx';
import {h} from '@cycle/dom';
import isolate from '@cycle/isolate';
import RxTween from 'rxtween';
import Examples from '~data/examples';
import {prepareInputDiagram, augmentWithExampleKey, makeNewInputDiagramsData$}
  from './sandbox-input';
import {getOutputDiagram$} from './sandbox-output';
import Immutable from 'immutable';
import Colors from '~styles/colors';
import Dimens from '~styles/dimens';
import Fonts from '~styles/fonts';
import {mergeStyles, elevation1Style, elevation2Style, elevation2Before, elevation2After}
  from '~styles/utils';
import Diagram from '~components/diagram/diagram';

function renderOperatorLabel(label) {
  let fontSize = (label.length >= 45) ? 1.3 : (label.length >= 30) ? 1.5 : 2;
  let style = {
    fontFamily: Fonts.fontCode,
    fontWeight: '400',
    fontSize: `${fontSize}rem`
  };
  return h('span.operatorLabel', {style}, label);
}

function renderOperator(label) {
  let style = mergeStyles({
      border: '1px solid rgba(0,0,0,0.06)',
      padding: Dimens.spaceMedium,
      textAlign: 'center'},
    elevation2Style
  );
  return h('div.operatorBox', {style}, [
    elevation2Before,
    renderOperatorLabel(label),
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

function renderSandbox$(DOM, inputDiagrams$, operatorLabel$, outputDiagram$, width$) {
  const data$ = inputDiagrams$
    .map(data => data.get('diagrams').map((diagram, index) =>
      Diagram({ DOM, props: {
        class: 'sandboxInputDiagram',
        key: `inputDiagram${index}`,
        data: Rx.Observable.of(diagram),
        interactive: Rx.Observable.of(true)
      }})
    ))
    .shareReplay()

  const output = Diagram({ DOM, props: {
    class: 'sandboxOutputDiagram',
    key: `outputDiagram`,
    data: outputDiagram$,
    interactive: Rx.Observable.of(false)
  }})

  const inputsVTrees$ = data$
    .map(Rx.Observable.fromArray)
    .flatMap(o => {
      return o
          .pluck("DOM")
          .toArray()
          .flatMap(array => Rx.Observable.combineLatest(array, (...args) => args))
    })

  const vtree$ = Rx.Observable.combineLatest(inputsVTrees$, operatorLabel$, width$, output.DOM, (inputs, label, width, output) => {
    let children = inputs.concat([
      renderOperator(label),
      output
    ])
    return h('div', { style: getSandboxStyle(width), attrs: { class: 'sandboxRoot' } }, children)
  })

  return {
    vtree$,
    data$
  }
}

function makeInputDiagrams(example) {
  return Immutable.Map({
    'diagrams': example.get('inputs')
      .map(prepareInputDiagram)
      .map(diag => augmentWithExampleKey(diag, example.get('key')))
  });
}

function markAsFirstDiagram(diagram) {
  return diagram.set('isFirst', true);
}

function markAllDiagramsAsFirst(diagramsData) {
  return diagramsData.update('diagrams', diagrams =>
    diagrams.map(markAsFirstDiagram)
  );
}

let isTruthy = (x => !!x);

function sandboxComponent({DOM, props$}) {
  const changeInputDiagram$ = Rx.Observable.defer(() => {
    return sandbox.data$
      .flatMap(list => list.map(diagram => diagram.data$))
      .flatMap(id => id)
  })

  const width$ = props$.map(p => p.width)
    .startWith('100%');
  const example$ = props$.map(p => p.route)
    .filter(isTruthy)
    .map(key => Immutable.Map(Examples[key]).set('key', key))
    .shareReplay(1);
  let inputDiagrams$ = example$
    .map(makeInputDiagrams)
    .map(markAllDiagramsAsFirst)
    .shareReplay(1);
  let newInputDiagrams$ = makeNewInputDiagramsData$(
    changeInputDiagram$, inputDiagrams$
  );
  let operatorLabel$ = example$.map(example => example.get('label'));
  let firstOutputDiagram$ = getOutputDiagram$(example$, inputDiagrams$)
    .map(markAsFirstDiagram);
  let newOutputDiagram$ = getOutputDiagram$(example$, newInputDiagrams$);
  let outputDiagram$ = firstOutputDiagram$.merge(newOutputDiagram$);
  
  let sandbox = renderSandbox$(DOM, inputDiagrams$, operatorLabel$, outputDiagram$, width$)

  return {
    DOM: sandbox.vtree$
  };
}

module.exports = sandboxComponent;
