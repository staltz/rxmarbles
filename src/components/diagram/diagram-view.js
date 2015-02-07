import Cycle from 'cyclejs';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import {mergeStyles, textUnselectable} from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

module.exports = Cycle.createView(Model => {
  let MARBLE_WIDTH = 5; // estimate of a marble width, in percentages
  let diagramSidePadding = Dimens.spaceMedium;
  let diagramVerticalMargin = Dimens.spaceLarge;
  let diagramArrowThickness = '2px';
  let diagramArrowSidePadding = Dimens.spaceLarge;
  let diagramArrowHeadSize = '8px';
  let diagramArrowColor = Colors.black;
  let diagramMarbleSize = Dimens.spaceLarge;
  let diagramCompletionHeight = '44px';

  function vrenderMarble(marbleData, isDraggable = false) {
    return h('x-marble', {
      data: marbleData,
      isDraggable,
      style: {size: diagramMarbleSize},
      onmousedown: 'marbleMouseDown$'
    });
  }

  function vrenderCompletion(diagramData, isDraggable = false) {
    let endTime = diagramData.get('end');
    let isTall = diagramData.get('notifications').some(marbleData =>
      Math.abs(marbleData.get('time') - diagramData.get('end')) <= MARBLE_WIDTH*0.5
    );
    return h('x-diagram-completion', {
      time: endTime,
      isDraggable,
      isTall,
      style: {
        thickness: diagramArrowThickness,
        color: diagramArrowColor,
        height: diagramCompletionHeight
      },
      onmousedown: 'completionMouseDown$'
    });
  }

  let diagramStyle = mergeStyles({
    position: 'relative',
    display: 'block',
    width: '100%',
    height: `calc(${diagramMarbleSize} + 2 * ${diagramVerticalMargin})`,
    overflow: 'visible',
    cursor: 'default'},
    textUnselectable
  );

  function vrenderDiagramArrow() {
    return h('div', {style: {
      backgroundColor: diagramArrowColor,
      height: diagramArrowThickness,
      position: 'absolute',
      top: `calc(${diagramVerticalMargin} + (${diagramMarbleSize} / 2))`,
      left: diagramSidePadding,
      right: diagramSidePadding
    }});
  }

  function vrenderDiagramArrowHead() {
    return h('div', {style: {
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

  let diagramBodyStyle = {
    position: 'absolute',
    left: `calc(${diagramArrowSidePadding} + ${diagramSidePadding} 
        + (${diagramMarbleSize} / 2))`,
    right: `calc(${diagramArrowSidePadding} + ${diagramSidePadding} 
        + (${diagramMarbleSize} / 2))`,
    top: `calc(${diagramVerticalMargin} + (${diagramMarbleSize} / 2))`,
    height: diagramCompletionHeight,
    marginTop: `calc(0px - (${diagramCompletionHeight} / 2))`
  };

  function vrenderDiagram(data, isInteractive) {
    let marblesVTree = data.get('notifications')
      .map(notification => vrenderMarble(notification, isInteractive))
      .toArray(); // from Immutable.List
    let completionVTree = vrenderCompletion(data, isInteractive);
    return h('div', {style: diagramStyle}, [
      vrenderDiagramArrow(),
      vrenderDiagramArrowHead(),
      h('div', {style: diagramBodyStyle}, [completionVTree].concat(marblesVTree))
    ])
  }

  return {
    vtree$: Rx.Observable.combineLatest(
      Model.get('data$').merge(Model.get('newData$')),
      Model.get('isInteractive$'),
      vrenderDiagram
    )
  };
});
