import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import RxTween from 'rxtween';
import {mergeStyles, textUnselectable} from 'rxmarbles/styles/utils';

const MARBLE_WIDTH = 5; // estimate of a marble width, in percentages
const diagramSidePadding = Dimens.spaceMedium;
const diagramArrowThickness = '2px';
const diagramArrowSidePadding = Dimens.spaceLarge;
const diagramArrowHeadSize = '8px';
const diagramArrowColor = Colors.black;
const diagramArrowColorGhost = Colors.almostWhite;
const diagramMarbleSize = Dimens.spaceLarge;
const diagramCompletionHeight = '44px';

function diagramVerticalMargin(isCompact) {
  return isCompact ? Dimens.spaceSmall : Dimens.spaceLarge;
}

function diagramStyle(isCompact) {
  return mergeStyles({
      position: 'relative',
      display: 'block',
      width: '100%',
      height: `calc(${diagramMarbleSize} + 2 * ${diagramVerticalMargin(isCompact)})`,
      overflow: 'visible',
      cursor: 'default'
    },
    textUnselectable
  );
}

const paddingToTimeline = `(${diagramArrowSidePadding} + ${diagramSidePadding} + (${diagramMarbleSize} / 2))`;
const timelineSize = `(100% - (2 * ${paddingToTimeline}))`;
function timeLeftPosition(time) {
  return `(${paddingToTimeline} + (${timelineSize} * ${time / 100}))`;
}
function timeRightPosition(time) {
  return `(${paddingToTimeline} + (${timelineSize} * ${(100 - time) / 100}))`;
}

function diagramBodyStyle(isCompact) {
  return {
    position: 'absolute',
    left: `calc(${paddingToTimeline})`,
    right: `calc(${paddingToTimeline})`,
    top: `calc(${diagramVerticalMargin(isCompact)} + (${diagramMarbleSize} / 2))`,
    height: diagramCompletionHeight,
    marginTop: `calc(0px - (${diagramCompletionHeight} / 2))`
  };
}

function renderMarble(marbleData, isDraggable = false, isGhost = false) {
  return h('x-marble.diagramMarble', {
    key: `marble${marbleData.get('id')}`,
    data: marbleData,
    isDraggable,
    style: {size: diagramMarbleSize},
    isGhost
  });
}

function renderEndpoints(diagramData, isDraggable = false) {
  var endpoints = [
    renderEndpoint(diagramData, 'start', 'diagramStart', false, false),
    renderEndpoint(diagramData, 'end', 'diagramCompletion', isDraggable, false)
    ];

  // add the eventualEndpoint if it is past the actyal end
  if (diagramData.get('eventualEnd') > diagramData.get('end')) {
    endpoints.push(renderEndpoint(diagramData, 'eventualEnd', 'diagramEventualEnd', false, true));
  }

  return endpoints;
}

function renderEndpoint(diagramData, timeName, endpointType, isDraggable, isGhost) {
  let endTime = diagramData.get(timeName);
  // do not render if the time is not defined, or it was at the end of our simulation
  if (endTime === undefined || endTime >= 100) {
    return undefined;
  }

  let color = isGhost ? diagramArrowColorGhost : diagramArrowColor;

  let isTall = diagramData.get('notifications').some(marbleData =>
    Math.abs(marbleData.get('time') - endTime) <= MARBLE_WIDTH*0.5
  );
  return h('x-diagram-completion.' + endpointType, {
    key: endpointType,
    time: endTime,
    isDraggable,
    isTall,
    style: {
      thickness: diagramArrowThickness,
      color: color,
      height: diagramCompletionHeight
    }
  });
}

function renderDiagramArrow(data, isCompact) {
  /* render the line in 3 segments:
   *  - to the left of 'start' render ghosted
   *  - render between start & end normal
   *  - to the right of 'end' render ghosted
   */
  const arrowStyle = {
    height: diagramArrowThickness,
    position: 'absolute',
    top: `calc(${diagramVerticalMargin(isCompact)} + (${diagramMarbleSize} / 2))`
  };
  let sections = [];
  let start = data.get('start');
  let end = data.get('end');
  let middleStart = diagramSidePadding;
  let middleEnd = diagramSidePadding;

  sections.push(h('div.diagramArrow', {
    style: mergeStyles(arrowStyle, {
      backgroundColor: diagramArrowColorGhost,
      left: middleStart,
      right: `calc(${timeRightPosition(start)})`
    })
  }));
  middleStart = `calc(${timeLeftPosition(start)})`;

  if (end < 100) {
    sections.push(h('div.diagramArrow', {
      style: mergeStyles(arrowStyle, {
        backgroundColor: diagramArrowColorGhost,
        left: `calc(${timeLeftPosition(end)})`,
        right: middleEnd
      })
    }));
    middleEnd = `calc(${timeRightPosition(end)})`;
  }

  if (start < end) {
    sections.push(h('div.diagramArrow', {
      style: mergeStyles(arrowStyle, {
        backgroundColor: diagramArrowColor,
        left: middleStart,
        right: middleEnd
      })
    }));
  }

  return sections;
}

function renderDiagramArrowHead(data, isCompact) {
  let end = data.get('end');
  let isGhost = end < 100;
  let color = isGhost ? diagramArrowColorGhost : diagramArrowColor;
  return h('div.diagramArrowHead', {style: {
    width: 0,
    height: 0,
    borderTop: `${diagramArrowHeadSize} solid transparent`,
    borderBottom: `${diagramArrowHeadSize} solid transparent`,
    borderLeft: `calc(2 * ${diagramArrowHeadSize}) solid ${color}`,
    display: 'inline-block',
    right: `calc(${diagramSidePadding} - 1px)`,
    position: 'absolute',
    top: `calc(${diagramVerticalMargin(isCompact)} + (${diagramMarbleSize} / 2)
      - ${diagramArrowHeadSize} + (${diagramArrowThickness} / 2))`
  }});
}

function renderDiagram(data, isInteractive, isCompact) {
  let marblesVTree = data.get('notifications')
    .map(notification => renderMarble(notification, isInteractive, notification.get('time') > (data.get('end') + 0.01)))
    .toArray(); // from Immutable.List
  return h('div', {style: diagramStyle(isCompact)}, [
    renderDiagramArrow(data, isCompact),
    renderDiagramArrowHead(data, isCompact),
    h('div', {style: diagramBodyStyle(isCompact)}, renderEndpoints(data, isInteractive).concat(marblesVTree))
  ])
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

function diagramView(model) {
  return {
    vtree$: Rx.Observable.combineLatest(
      animateData$(model.data$).merge(model.newData$),
      model.isInteractive$,
      model.isCompact$,
      renderDiagram
    )
  };
}

module.exports = diagramView;
