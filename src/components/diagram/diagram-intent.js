import Cycle from 'cyclejs';
import Immutable from 'immutable';
let Rx = Cycle.Rx;

const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove');
const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');

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

function diagramIntent(interactions) {
  let marbleMouseDown$ = interactions.get('.diagramMarble', 'mousedown');
  let completionMouseDown$ = interactions.get('.diagramCompletion', 'mousedown');

  return {
    changeMarbleTime$: makeDeltaTime$(marbleMouseDown$,
      (deltaTime, target) => Immutable.Map({
        deltaTime: deltaTime,
        id: target.attributes['data-marble-id'].value
      })
    ),
    changeEndTime$: makeDeltaTime$(completionMouseDown$)
  };
}

module.exports = diagramIntent;
