import Cycle from 'cyclejs';
let Rx = Cycle.Rx;

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

function diagramModel(properties, intent) {
  let data$ = properties.get('data').distinctUntilChanged().shareReplay(1);
  return {
    data$: data$,
    newData$: makeNewDiagramData$(
      data$,
      intent.changeMarbleTime$,
      intent.changeEndTime$,
      properties.get('interactive')
    ),
    isInteractive$: properties.get('interactive').startWith(false)
  };
}

module.exports = diagramModel;
