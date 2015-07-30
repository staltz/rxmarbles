import {Rx} from '@cycle/core';

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

function makeNewDiagramData$(data$, changeMarbleTime$, changeEndTime$, interactive$) {
  let mod$ = Rx.Observable.merge(
    changeMarbleTime$.map(x => data => applyChangeMarbleTime(data, x)),
    changeEndTime$.map(x => data => applyChangeEndTime(data, x))
  ).pausable(interactive$);
  return data$
    .flatMapLatest(data => mod$.scan(data, (acc, mod) => mod(acc)))
    .map(applyDiagramDataConstraints)
}

function diagramModel(props, intent) {
  let data$ = props.get('data').distinctUntilChanged().shareReplay(1);
  return {
    data$: data$,
    newData$: makeNewDiagramData$(
      data$,
      intent.changeMarbleTime$,
      intent.changeEndTime$,
      props.get('interactive')
    ),
    isInteractive$: props.get('interactive').startWith(false)
  };
}

module.exports = diagramModel;
