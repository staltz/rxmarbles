/*
 * Functions to handle data of input diagrams in the example shown in the
 * sandbox.
 */
var Rx = require('rx');
var Utils = require('rxmarbles/models/utils');

function prepareNotification(input, diagramId) {
  if (typeof input.time !== "undefined") {
    return input;
  }
  var output = {
    time: input.t,
    content: input.d,
    diagramId: diagramId
  };
  output.id = Utils.calculateNotificationHash(output);
  return output;
}

function getNotifications(diagram) {
  var last = diagram[diagram.length - 1];
  if (typeof last === 'number') {
    return diagram.slice(0, -1);
  } else {
    return diagram;
  }
}

function cloneMarble(marble) {
  return {
    id: marble.id,
    time: marble.time,
    content: marble.content,
    diagramId: marble.diagramId
  }
}

function cloneDiagram(diagram) {
  var newDiagram = diagram.map(cloneMarble); // copy all marble data
  newDiagram.id = diagram.id;
  newDiagram.end = diagram.end;
  return newDiagram;
}

function prepareInputDiagram(diagram, indexInDiagramArray) {
  if (indexInDiagramArray == null) {
    indexInDiagramArray = 0;
  }
  var notifications = getNotifications(diagram);
  var last = diagram[diagram.length - 1];
  // TODO convert this for into functional array .map()
  var preparedDiagram = notifications.map(function (notification) {
    return prepareNotification(notification, indexInDiagramArray);
  });
  preparedDiagram.end = (typeof last === 'number') ? last : 100;
  preparedDiagram.id = indexInDiagramArray;
  return preparedDiagram;
}

function updateEachDiagram(delta) {
  return function(diagram, diagramIndex) {
    // Ignore diagram if it doesn't match what the delta is related to
    if (diagramIndex !== delta.diagram) {
      return diagram;
    }
    // Make new diagram
    var newDiagram;
    if (delta.type === 'marble') {
      newDiagram = cloneDiagram(diagram).map(updateEachMarble(delta));
      newDiagram.end = diagram.end;
      newDiagram.id = diagram.id;
    } else if (delta.type === 'completion') {
      newDiagram = cloneDiagram(diagram)
      var newTime = diagram.end + delta.deltaTime;
      if (newTime < 0) { newTime = 0; }
      if (newTime > 100) { newTime = 100; }
      newDiagram.end = newTime;
    }
    // Constraint: completion time should not be smaller than any marble time
    var maxMarbleTime = newDiagram.reduce(function(a,b) {
      if (a.time > b.time) {
        return a;
      } else {
        return b;
      }
    }, {time:0}).time;
    if (newDiagram.end < maxMarbleTime) {
      newDiagram.end = maxMarbleTime;
    }
    return newDiagram;
  };
}

function updateEachMarble(delta) {
  return function(marble) {
    // Ignore marble if it doesn't match what the delta is related to
    if (marble.id !== delta.marble) {
      return marble;
    }
    // Make new time
    var newTime = marble.time + delta.deltaTime;
    if (newTime < 0) { newTime = 0; }
    if (newTime > 100) { newTime = 100; }
    // Make new marble
    return {
      time: newTime,
      content: marble.content,
      diagramId: marble.diagramId,
      id: marble.id
    };
  };
}

function getInputDiagrams$(example$, inputMarbleDelta$, inputCompletionDelta$) {
  return example$
    .flatMap(function(example) {
      var initialDiagrams = example["inputs"].map(prepareInputDiagram);
      return Rx.Observable
        .merge(
          inputMarbleDelta$.map(function (delta) {
            delta.type = 'marble';
            return delta;
          }),
          inputCompletionDelta$.map(function (delta) {
            delta.type = 'completion';
            return delta;
          })
        )
        .scan(initialDiagrams, function(acc, delta) {
          return acc.map(updateEachDiagram(delta))
        })
        // Guarantee immutability
        .map(function (diagrams) {
          return diagrams.map(cloneDiagram);
        })
        // Round up all marble times and completion time
        .map(function(diagrams) {
          diagrams.forEach(function(diagram) {
            diagram.end = Math.round(diagram.end);
            diagram.forEach(function(marble) {
              marble.time = Math.round(marble.time);
            })
          });
          return diagrams;
        })
        .startWith(initialDiagrams);
    });
}

module.exports = {
  getInputDiagrams$: getInputDiagrams$
};
