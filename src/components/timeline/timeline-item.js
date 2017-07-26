import { Observable } from 'rxjs';
import { add, compose, path, multiply, max, min } from 'ramda';

const mouseMove$ = Observable.fromEvent(document, 'mousemove');
const mouseUp$ = Observable.fromEvent(document, 'mouseup');

function getPercentageFn(element) {
  const { width, left } = element.getBoundingClientRect();
  const ratio = (100 / width) || 0.15;
  const elementLeft = left + window.scrollX;
  return (x) => (x - elementLeft) * ratio;
}

function getPausable$(pause$, obsv$) {
  return pause$
    .switchMap(pause => pause ? obsv$ : Observable.never());
}

function intent(elementClass, DOMSource, isDraggable$) {
  const element = DOMSource.select('.' + elementClass);

  const startHighlight$ = element.events('mouseenter').mapTo(true);
  const stopHighlight$ = element.events('mouseleave').mapTo(false);
  const isHighlighted$ = getPausable$(
    isDraggable$, Observable.merge(startHighlight$, stopHighlight$))
    .startWith(false)
    .publishReplay(1).refCount();

  const timeChange$ = element.events('mousedown')
    .map(path(['currentTarget', 'parentElement']))
    .map(getPercentageFn)
    .switchMap(getPercentage =>
      mouseMove$.takeUntil(mouseUp$)
        .pluck('pageX')
        .map(getPercentage)
        .distinctUntilChanged()
    );

  return { timeChange$, isHighlighted$ };
}

function model(props$, timeSource$, timeChange$, isDraggable$) {
  const restrictedTimeChange$ = getPausable$(isDraggable$, timeChange$)
    .map(max(0))
    .map(min(100));

  const minChange$ = props$.pluck('minTime')
    .distinctUntilChanged()
    .withLatestFrom(timeSource$, max);

  const maxChange$ = props$.pluck('maxTime')
    .distinctUntilChanged()
    .withLatestFrom(timeSource$, min);

  return Observable.merge(
    // order matters
    timeSource$, restrictedTimeChange$, minChange$, maxChange$)
    .distinctUntilChanged()
    .publishReplay(1).refCount();
}

export function timelineItem(elementClass, view, sources) {
  const { DOM, props, time: timeSource$, isDraggable } = sources;
  const { timeChange$, isHighlighted$ }
    = intent(elementClass, DOM, isDraggable);
  const time$ = model(props, timeSource$, timeChange$, isDraggable);
  const vtree$ = view(sources, time$, isHighlighted$);
  return { DOM: vtree$, time: time$ };
}
