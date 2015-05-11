import Cycle from 'cyclejs';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import {mergeStyles, textUnselectable} from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

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

function renderMarble(marbleData, isDraggable = false) {
  return h('x-marble.diagramMarble', {
    key: `marble${marbleData.get('id')}`,
    data: marbleData,
    isDraggable,
    style: {size: diagramMarbleSize}
  });
}

function renderCompletion(diagramData, isDraggable = false) {
  let endTime = diagramData.get('end');
  let isTall = diagramData.get('notifications').some(marbleData =>
    Math.abs(marbleData.get('time') - diagramData.get('end')) <= MARBLE_WIDTH*0.5
  );
  return h('x-diagram-completion.diagramCompletion', {
    key: 'completion',
    time: endTime,
    isDraggable,
    isTall,
    style: {
      thickness: diagramArrowThickness,
      color: diagramArrowColor,
      height: diagramCompletionHeight
    }
  });
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

function renderDiagram(data, isInteractive) {
  let marblesVTree = data.get('notifications')
    .map(notification => renderMarble(notification, isInteractive))
    .toArray(); // from Immutable.List
  let completionVTree = renderCompletion(data, isInteractive);
  return h('div', {style: diagramStyle}, [
    renderDiagramArrow(),
    renderDiagramArrowHead(),
    h('div', {style: diagramBodyStyle}, [completionVTree].concat(marblesVTree))
  ])
}

function diagramView(model) {
  return {
    vtree$: Rx.Observable.combineLatest(
      model.data$.merge(model.newData$), model.isInteractive$,
      renderDiagram
    )
  };
}

module.exports = diagramView;
