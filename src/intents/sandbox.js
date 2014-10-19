/*
 * SandboxIntent
 */
var Rx = require('rx');
var replicate = require('rxmarbles/utils').replicate;

var inputMarbleMouseDown$ = new Rx.Subject();
var inputCompletionMouseDown$ = new Rx.Subject();
var mouseMove$ = Rx.Observable.fromEvent(document, "mousemove");
var mouseUp$ = Rx.Observable.fromEvent(document, "mouseup");

function observe(view) {
  replicate(view.marbleMouseDown$, inputMarbleMouseDown$);
  replicate(view.completionMouseDown$, inputCompletionMouseDown$);
}

function makeDeltaDrag$(mouseDown$, resultFunction) {
  return mouseDown$
    .map(function(event) {
      var target = event.currentTarget;
      return mouseMove$
        .map(function(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          return ev.pageX;
        })
        .windowWithCount(2,1)
        .flatMap(function(result) { return result.toArray(); })
        .map(function(array) {
          var dx = array[1] - array[0]; // the drag dx in pixels
          var pxToPercentage;
          try {
            if (target && target.parentElement && target.parentElement.clientWidth) {
              pxToPercentage = 100.0 / target.parentElement.clientWidth;
            } else {
              throw new Error('Invalid marble parent or parent width.');
            }
          } catch (err) {
            console.warn(err);
            pxToPercentage = 0.15; // a 'safe enough' magic number
          }
          var deltaTime = dx * pxToPercentage;
          return resultFunction(target, deltaTime);
        })
        .takeUntil(mouseUp$);
    })
    .concatAll();
}

var marbleDelta$ = makeDeltaDrag$(
  inputMarbleMouseDown$,
  function (target, deltaTime) {
    return {
      'diagram': Number(target.attributes['data-diagram-id'].value),
      'marble': Number(target.attributes['data-marble-id'].value),
      'deltaTime': deltaTime
    };
  }
);

var completionDelta$ = makeDeltaDrag$(
  inputCompletionMouseDown$,
  function (target, deltaTime) {
    return {
      'diagram': Number(target.attributes['data-diagram-id'].value),
      'deltaTime': deltaTime
    };
  }
);

module.exports = {
  observe: observe,
  marbleDelta$: marbleDelta$,
  completionDelta$: completionDelta$
};
