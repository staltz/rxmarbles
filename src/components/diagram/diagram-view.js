import Rx from 'rx';
import {h} from '@cycle/dom';
import Colors from '~styles/colors';
import Dimens from '~styles/dimens';
import Fonts from '~styles/fonts';
import RxTween from 'rxtween';
import {mergeStyles, textUnselectable} from '~styles/utils';
import Marble from '~components/marble';
import DiagramCompletion from '~components/diagram-completion';

const MARBLE_WIDTH = 5; // estimate of a marble width, in percentages
const diagramSidePadding = Dimens.spaceMedium;
const diagramVerticalMargin = Dimens.spaceLarge;
const diagramArrowThickness = '2px';
const diagramArrowSidePadding = Dimens.spaceLarge;
const diagramArrowHeadSize = '8px';
const diagramArrowColor = Colors.black;
const diagramMarbleSize = Dimens.spaceLarge;
const diagramCompletionHeight = '44px';

const diagramStyle = mergeStyles({
  position: 'relative',
  display: 'block',
  width: '100%',
  height: `calc(${diagramMarbleSize} + 2 * ${diagramVerticalMargin})`,
  overflow: 'visible',
  cursor: 'default'},
  textUnselectable
);

const diagramBodyStyle = {
  position: 'absolute',
  left: `calc(${diagramArrowSidePadding} + ${diagramSidePadding}
      + (${diagramMarbleSize} / 2))`,
  right: `calc(${diagramArrowSidePadding} + ${diagramSidePadding}
      + (${diagramMarbleSize} / 2))`,
  top: `calc(${diagramVerticalMargin} + (${diagramMarbleSize} / 2))`,
  height: diagramCompletionHeight,
  marginTop: `calc(0px - (${diagramCompletionHeight} / 2))`
};

function renderMarble$(DOM, marbleData$, isDraggable$) {
  const props = Rx.Observable.combineLatest(marbleData$, isDraggable$, (data, isDraggable) => ({
    key: `marble${data.id}`,
    data: data,
    isDraggable,
    style: {size: diagramMarbleSize}
  }))
  return Marble({ DOM, props })
}

function renderCompletion$(DOM, diagramData$, isDraggable$) {
  return diagramData$
  .combineLatest(isDraggable$, (data, isDraggable) => ({data, isDraggable}))
  .flatMap(({data, isDraggable}) => { 
    let isTall = data.get('notifications').some(marbleData =>
      Math.abs(marbleData.get('time') - data.get('end')) <= MARBLE_WIDTH*0.5
    );
    const completion = DiagramCompletion({DOM, props: {
      key: 'completion',
      time: data.get('end'),
      isDraggable,
      isTall,
      style: {
        thickness: diagramArrowThickness,
        color: diagramArrowColor,
        height: diagramCompletionHeight
      }
    }})
    return completion.DOM;
  })
}

function renderDiagramArrow() {
  return h('div.diagramArrow', {style: {
    backgroundColor: diagramArrowColor,
    height: diagramArrowThickness,
    position: 'absolute',
    top: `calc(${diagramVerticalMargin} + (${diagramMarbleSize} / 2))`,
    left: diagramSidePadding,
    right: diagramSidePadding
  }});
}

function renderDiagramArrowHead() {
  return h('div.diagramArrowHead', {style: {
    width: 0,
    height: 0,
    borderTop: `${diagramArrowHeadSize} solid transparent`,
    borderBottom: `${diagramArrowHeadSize} solid transparent`,
    borderLeft: `calc(2 * ${diagramArrowHeadSize}) solid ${diagramArrowColor}`,
    display: 'inline-block',
    right: `calc(${diagramSidePadding} - 1px)`,
    position: 'absolute',
    top: `calc(${diagramVerticalMargin} + (${diagramMarbleSize} / 2)
      - ${diagramArrowHeadSize} + (${diagramArrowThickness} / 2))`
  }});
}

function renderDiagram$(DOM, data$, isInteractive$, props) {
  // TODO optimize here to create a single Marble and maintain it, updating state,
  // just like D3 has Enter, Leave and Change events. Build it using GroupBy?
  const marbles$ = data$
    .map(d => d.get('notifications').toJS())
    .map(d => d
      // Non-reactive list of marbles for now
      .map(n => renderMarble$(DOM, Rx.Observable.of(n), isInteractive$))
    )
    .shareReplay()
  const completions$ = renderCompletion$(DOM, data$, isInteractive$)
  const elements$ = Rx.Observable
    .combineLatest(
      completions$,
      marbles$.map(c => c.map(_ => _.DOM)),
      (c, ms) => ms.concat([Rx.Observable.just(c)])
    )
    .flatMap(es => Rx.Observable.combineLatest(es, (...args) => args))
  
  const vtree$ = elements$.map(es => h('div', { 
      style: diagramStyle,
      attrs: {class: props.class }
    }, [
      renderDiagramArrow(),
      renderDiagramArrowHead(),
      h('div', {style: diagramBodyStyle}, es)
    ]))

  return { 
    vtree$,
    click$: marbles$.flatMap(c => { 
        return Rx.Observable.merge(c.map(_ => _.click$))
      })
  }
}

function sanitizeDiagramItem(x) {
  return Math.max(0, Math.min(100, x));
}

function interpolate(from, to, x) {
  return (from * (1 - x) + to * x);
}

function animateData$(data$) {
  const animConf = {
    from: 0,
    to: 1,
    ease: RxTween.Power3.easeOut,
    duration: 600
  };
  return data$.flatMapLatest(data => {
    if (!data.get('isFirst')) {
      return Rx.Observable.just(data);
    } else {
      let randomizedNotifs = data.get('notifications').map(notif =>
        notif.update('time', time =>
          time - 10 + 20 * Math.random()
        )
      );

      return RxTween(animConf).map(x =>
        data.update('notifications', notifications =>
          notifications.zipWith((n1, n2) =>
            n1.update('time', t1 => {
              let t2 = n2.get('time');
              return interpolate(t2, t1, x);
            }),
            randomizedNotifs
          )
        )
      );
    }
  })
}

function diagramView({ DOM, model, props }) {
  // TODO animate, animation is disabled for now as it is WAY to slow for the full DOM
  // const data$ = animateData$(model.data$).merge(model.newData$)
  const data$ = model.data$.merge(model.newData$).shareReplay(1)
  const isInteractive$ = model.isInteractive$
  return renderDiagram$(DOM, data$, isInteractive$, props)
}

module.exports = diagramView;
