import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import RxTween from 'rxtween';
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

function renderOperatorLabel(label, small = false) {
  let fontSize = (label.length >= 45) ? 1.3 : (label.length >= 30) ? 1.5 : 2;
  if (small) {
    fontSize *= 0.5;
  }
  let style = {
    fontFamily: Fonts.fontCode,
    fontWeight: '400',
    fontSize: `${fontSize}rem`
  };
  return h('span.operatorLabel', {style}, label);
}

function renderOperator(label, small = false) {
  let style = mergeStyles({
      border: '1px solid rgba(0,0,0,0.06)',
      padding: small ? Dimens.spaceTiny : Dimens.spaceMedium,
      textAlign: 'center'},
    elevation2Style
  );
  return h('div.operatorBox', {style}, [
    elevation2Before,
    renderOperatorLabel(label, small),
    elevation2After
  ]);
}

function renderObservedInputs(inputs) {
  return inputs.map((input, i) => h('x-diagram.sandboxObservedInput', {
    key: "observedInput" + i,
    data: input,
    interactive: false,
    compact: true
  }));
}

function getSandboxStyle(width) {
  return mergeStyles({
      background: Colors.white,
      width: width,
      borderRadius: '2px'},
    elevation1Style
  );
}

function renderSandbox(inputDiagrams, operatorLabel, outputDiagramData, width, showSubscriptions) {
  let children = [
    inputDiagrams.get('diagrams').map((diagram, index) =>
        h('x-diagram.sandboxInputDiagram', {
          key: `inputDiagram${index}`,
          data: diagram,
          interactive: true
        })
    ),
    renderOperator(operatorLabel),
    h('x-diagram.sandboxOutputDiagram', {
      key: 'outputDiagram',
      data: outputDiagramData.outputDiagram,
      interactive: false
    })];

  if (showSubscriptions) {
    children.push(
      renderOperator("subscription details", true),
      renderObservedInputs(outputDiagramData.observedInputDiagrams));
  }

  return h('div.sandboxRoot', {style: getSandboxStyle(width)}, children);
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

function sandboxComponent({DOM, props}) {
  let changeInputDiagram$ = DOM.get('.sandboxInputDiagram', 'newdata')
    .map(ev => ev.detail);
  let width$ = props.get('width').startWith('100%');
  let showSubscriptions$ = props.get('showSubscriptions').startWith(true);
  let example$ = props.get('route')
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
    .map(d => {
      return {
        outputDiagram: markAsFirstDiagram(d.outputDiagram),
        observedInputDiagrams: d.observedInputDiagrams.map(markAsFirstDiagram)
      };
  })
  let newOutputDiagram$ = getOutputDiagram$(example$, newInputDiagrams$);
  let outputDiagram$ = firstOutputDiagram$.merge(newOutputDiagram$);
  let vtree$ = Rx.Observable.combineLatest(
    inputDiagrams$, operatorLabel$, outputDiagram$, width$,
    showSubscriptions$,
    renderSandbox
  );

  return {
    DOM: vtree$
  };
}

module.exports = sandboxComponent;
