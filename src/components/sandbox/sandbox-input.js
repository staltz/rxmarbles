/*
 * Functions to handle data of input diagrams in the example shown in the
 * sandbox.
 */
import {Rx} from 'cyclejs';
import Utils from 'rxmarbles/components/sandbox/utils';
import Immutable from 'immutable';

function getNotifications(diagram) {
  let last = diagram[diagram.length - 1];
  if (typeof last === 'number') {
    return Immutable.List(diagram.slice(0, -1));
  } else {
    return Immutable.List(diagram);
  }
}

function prepareNotification(input, diagramId) {
  if (input && input.get && typeof input.get('time') !== 'undefined') {
    return input; // is already a prepared notification
  }
  return Immutable.Map({})
    .set('time', input.t)
    .set('content', input.d)
    .set('diagramId', diagramId)
    .set('id', Utils.calculateNotificationHash({time: input.t, content: input.d}));
}

function prepareInputDiagram(diagram, indexInDiagramArray = 0) {
  let last = diagram[diagram.length - 1];
  return Immutable.Map({})
    .set('notifications', getNotifications(diagram)
      .map(notification => prepareNotification(notification, indexInDiagramArray))
    )
    .set('end', (typeof last === 'number') ? last : 100)
    .set('id', indexInDiagramArray);
}

function augmentWithExampleKey(diagramData, exampleKey) {
  return diagramData
    .set('example', exampleKey)
    .set('notifications', diagramData.get('notifications')
      .map(notif => notif.set('example', exampleKey))
    );
}

function replaceDiagramDataIn(diagrams, newDiagramData) {
  return diagrams.map(diagramData => {
    if (diagramData.get('id') === newDiagramData.get('id')) {
      return newDiagramData;
    } else {
      return diagramData;
    }
  });
}

function makeNewInputDiagramsData$(changeInputDiagram$, inputs$) {
  return Rx.Observable.merge(changeInputDiagram$, inputs$)
    .scan((prev, curr) => {
      let currentIsDiagramData = !!curr && curr.get && !!curr.get('notifications');
      if (!currentIsDiagramData) {
        return curr.set('isInitialData', true);
      }
      if (!prev || !prev.get || !Array.isArray(prev.get('diagrams'))) {
        console.warn('Inconsistency in SandboxComponent.makeNewInputDiagramsData$()');
      }
      let inputs = prev;
      let newDiagramData = curr;
      return inputs
        .set('diagrams', replaceDiagramDataIn(inputs.get('diagrams'), newDiagramData))
        .set('isInitialData', false);
    })
    .filter(x => !x.get('isInitialData')); // only allow new diagram data
}

module.exports = {
  prepareInputDiagram: prepareInputDiagram,
  augmentWithExampleKey: augmentWithExampleKey,
  makeNewInputDiagramsData$: makeNewInputDiagramsData$
};
