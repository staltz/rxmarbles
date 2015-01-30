import Cycle from 'cyclejs';
import svg from 'cyclejs/node_modules/virtual-dom/virtual-hyperscript/svg';
import Immutable from 'immutable';
let Rx = Cycle.Rx;
let h = Cycle.h;

var MARBLE_WIDTH = 5; // estimate of a marble width, in percentages
var NUM_COLORS = 4;
let mouseMove$ = Rx.Observable.fromEvent(document, "mousemove");
let mouseUp$ = Rx.Observable.fromEvent(document, "mouseup");

function getPxToPercentageRatio(element) {
  let pxToPercentage;
  try {
    if (element && element.parentElement && element.parentElement.clientWidth) {
      pxToPercentage = 100.0 / element.parentElement.clientWidth;
    } else {
      throw new Error('Invalid marble parent or parent width.');
    }
  } catch (err) {
    console.warn(err);
    pxToPercentage = 0.15; // a 'safe enough' magic number
  }
  return pxToPercentage;
}

function makeDeltaTime$(mouseDown$, resultFn) {
  return mouseDown$
    .map(downevent => {
      let target = downevent.currentTarget;
      let pxToPercentage = getPxToPercentageRatio(target);
      return mouseMove$.takeUntil(mouseUp$)
        .pairwise()
        .map(([ev1, ev2]) => {
          const dx = ev2.pageX - ev1.pageX; // the drag dx in pixels
          const deltaTime = dx * pxToPercentage;
          if (!!resultFn) {
            return resultFn(deltaTime, target);
          } else {
            return deltaTime;
          }
        })
        .filter(x => x !== 0);
    })
    .concatAll();
}

function vrenderMarble(marbleData, isDraggable = false) {
  let colornum = (marbleData.get('id') % NUM_COLORS) + 1;
  let leftPos = '' + marbleData.get('time') + '%';
  let content = '' + marbleData.get('content');
  return h('div.marble.js-marble'+(isDraggable ? '.is-draggable' :''), {
    style: {'left': leftPos, 'z-index': marbleData.get('time')},
    attributes: {'data-marble-id': marbleData.get('id')},
    onmousedown: 'marbleMouseDown$'
  },[
    svg('svg', {attributes: {'class': 'marble-inner', viewBox: '0 0 1 1'}}, [
      svg('circle', {
        attributes: {
          class: 'marble-shape marble-shape--color' + colornum,
          cx: 0.5, cy: 0.5, r: 0.47,
          'stroke-width': '0.06px'
        }
      })
    ]),
    h('p.marble-content', String(content))
  ]);
}

function vrenderCompletion(diagramData, isDraggable = false) {
  let isDraggableClass = (isDraggable) ? '.is-draggable' : '';
  let isTall = diagramData.get('notifications').some(marbleData =>
    Math.abs(marbleData.get('time') - diagramData.get('end')) <= MARBLE_WIDTH*0.5
  );
  let isTallClass = (isTall) ? '.is-tall' : '';
  return h('div.diagramCompletion' + isDraggableClass + isTallClass, {
    style: {'left': diagramData.get('end') + '%'},
    attributes: {'data-diagram-id': diagramData.get('id')},
    onmousedown: 'completionMouseDown$'
  },[
    h('div.diagramCompletion-inner')
  ]);
}

function vrenderDiagram(data, isInteractive) {
  let marblesVTree = data.get('notifications')
    .map(notification => vrenderMarble(notification, isInteractive))
    .toArray(); // from Immutable.List
  let completionVTree = vrenderCompletion(data, isInteractive);

  return h('div.diagram', [
    h('div.diagram-arrow'),
    h('div.diagram-arrowHead'),
    h('div.diagram-body', [completionVTree].concat(marblesVTree))
  ])
}

function findLargestMarbleTime(diagramData) {
  return diagramData.get('notifications')
    .max((notifA, notifB) => {
      if (notifA.get('time') < notifB.get('time')) { return -1; }
      if (notifA.get('time') > notifB.get('time')) { return 1; }
      return 0;
    })
    .get('time');
}

function applyChangeMarbleTime(diagramData, marbleDelta) {
  return diagramData
    .set('notifications',
      diagramData.get('notifications')
      .map(notif => {
        if (String(notif.get('id')) === String(marbleDelta.get('id'))) {
          let newTime = notif.get('time') + marbleDelta.get('deltaTime');
          return notif.set('time', newTime);
        } else {
          return notif;
        }
      })
    );
}

function applyChangeEndTime(diagramData, endDelta) {
  return diagramData
    .set('end', diagramData.get('end') + endDelta);
}

function applyMarbleDataConstraints(marbleData) {
  let newTime = marbleData.get('time');
  newTime = Math.round(newTime);
  newTime = Math.min(newTime, 100);
  newTime = Math.max(0, newTime);
  return marbleData.set('time', newTime);
}

function applyEndTimeConstraint(diagramData) {
  let largestMarbleTime = findLargestMarbleTime(diagramData);
  let newEndTime = diagramData.get('end');
  newEndTime = Math.max(newEndTime, largestMarbleTime);
  newEndTime = Math.round(newEndTime);
  newEndTime = Math.min(newEndTime, 100);
  newEndTime = Math.max(0, newEndTime);
  return diagramData.set('end', newEndTime);
}

function applyDiagramDataConstraints(diagramData) {
  let newDiagramData = diagramData.set('notifications',
    diagramData.get('notifications').map(applyMarbleDataConstraints)
  );
  newDiagramData = applyEndTimeConstraint(newDiagramData);
  return newDiagramData;
}

function newDiagramDataScanner(prev, curr) {
  let currentIsDiagramData = !!curr && !!curr.get && !!curr.get('notifications');
  if (!currentIsDiagramData) {
    let previousIsDiagramData = !!prev && !!prev.get('notifications');
    if (!previousIsDiagramData) {
      console.warn('Inconsistency in DiagramComponent.makeNewDiagramData$()');
    }
    let diagramData = prev;
    let changeInstructions = curr;
    let newDiagramData;
    if (typeof changeInstructions === 'number') {
      newDiagramData = applyChangeEndTime(diagramData, changeInstructions);
    } else {
      newDiagramData = applyChangeMarbleTime(diagramData, changeInstructions);
    }
    return newDiagramData.set('isInitialData', false);
  } else {
    return curr.set('isInitialData', true);
  }
}

function makeNewDiagramData$(data$, changeMarbleTime$, changeEndTime$, interactive$) {
  return data$
    .merge(changeMarbleTime$).merge(changeEndTime$).scan(newDiagramDataScanner)
    .filter(diagramData => !diagramData.get('isInitialData'))
    .map(applyDiagramDataConstraints)
    .pausable(interactive$);
}

let DiagramComponent = Cycle.createView(Attributes => {
  let Model = Cycle.createModel((Attributes, Intent) => ({
    data$: Attributes.get('data$').distinctUntilChanged(),
    newData$: makeNewDiagramData$(
      Attributes.get('data$').distinctUntilChanged(),
      Intent.get('changeMarbleTime$'),
      Intent.get('changeEndTime$'),
      Attributes.get('interactive$')
    ),
    isInteractive$: Attributes.get('interactive$').startWith(false)
  }));

  let View = Cycle.createView(Model => ({
    vtree$: Rx.Observable.combineLatest(
      Model.get('data$').merge(Model.get('newData$')),
      Model.get('isInteractive$'),
      vrenderDiagram
    )
  }));

  let Intent = Cycle.createIntent(View => ({
    changeMarbleTime$: makeDeltaTime$(
      View.get('marbleMouseDown$'),
      (deltaTime, target) => Immutable.Map({
        deltaTime: deltaTime,
        id: target.attributes['data-marble-id'].value
      })
    ),
    changeEndTime$: makeDeltaTime$(View.get('completionMouseDown$'))
  }));

  Intent.inject(View).inject(Model).inject(Attributes, Intent);

  return {
    vtree$: View.get('vtree$'),
    newdata$: Model.get('newData$')
  };
});

module.exports = DiagramComponent;
