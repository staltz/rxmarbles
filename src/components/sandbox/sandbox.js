import Cycle from 'cyclejs';
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
let Rx = Cycle.Rx;
let h = Cycle.h;

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

function renderSandbox(inputDiagrams, operatorLabel, outputDiagram, width) {
  return h('div.sandboxRoot', {style: getSandboxStyle(width)}, [
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
      data: outputDiagram,
      interactive: false
    })
  ]);
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

//function animateData$(inputDiagrams$) {
//  //return diagrams$.doOnNext(diagrams => console.log(diagrams.toJS()));
//  const animConf = {
//    from: 10,
//    to: 0,
//    ease: RxTween.Power3.easeOut,
//    duration: 1000
//  };
//  return inputDiagrams$.flatMapLatest(inputDiagrams => {
//    return RxTween(animConf).map(x =>
//      inputDiagrams.update('diagrams', diagrams =>
//        diagrams.map(diagram =>
//          diagram.update('notifications', notifications =>
//            notifications.map(notif =>
//              notif.update('time', time => time + x)
//            )
//          )
//        )
//      )
//    );
//  })
//}

function sandboxComponent(interactions, properties) {
  let changeInputDiagram$ = interactions.get('.sandboxInputDiagram', 'newdata')
    .map(ev => ev.data);
  let width$ = properties.get('width').startWith('100%');
  let example$ = properties.get('route')
    .filter(isTruthy)
    .map(key => Immutable.Map(Examples[key]).set('key', key))
    .shareReplay(1);
  let inputDiagrams$ = example$
    .map(makeInputDiagrams)
    .map(markAllDiagramsAsFirst)
    .shareReplay(1);
  //inputDiagrams$ = animateData$(inputDiagrams$);
  let newInputDiagrams$ = makeNewInputDiagramsData$(
    changeInputDiagram$, inputDiagrams$
  );
  //let allInputDiagrams$ = inputDiagrams$.merge(newInputDiagrams$);
  let operatorLabel$ = example$.map(example => example.get('label'));
  let firstOutputDiagram$ = getOutputDiagram$(example$, inputDiagrams$)
    .map(markAsFirstDiagram);
  let newOutputDiagram$ = getOutputDiagram$(example$, newInputDiagrams$);
  let outputDiagram$ = firstOutputDiagram$.merge(newOutputDiagram$);

  return {
    vtree$: Rx.Observable.combineLatest(
      inputDiagrams$, operatorLabel$, outputDiagram$, width$, renderSandbox
    )
  };
}

module.exports = sandboxComponent;
