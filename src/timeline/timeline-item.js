import { Observable } from 'rxjs';
import { add, compose, path, multiply, max, min } from 'ramda';

const mouseMove$ = Observable.fromEvent(document, 'mousemove');
const mouseUp$ = Observable.fromEvent(document, 'mouseup');

function getPercentageFn(element) {
  const ratio = (100 / element.clientWidth) || 0.15;
  const elementLeft = element.getBoundingClientRect().left + window.scrollX;
  return (x) => (x - elementLeft) * ratio;
}

function intent(elementClass, DOMSource) {
  const element = DOMSource.select('.' + elementClass);

  const startHighlight$ = element.events('mouseenter').mapTo(true);
  const stopHighlight$ = element.events('mouseleave').mapTo(false);
  const isHighlighted$ = Observable.merge(startHighlight$, stopHighlight$)
    .startWith(false);

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

function model(props$, timeSource$, timeChange$) {
  const restrictedTimeChange$ = timeChange$
    .map(max(0))
    .map(min(100))
    .publishReplay(1).refCount();

  const minChange$ = props$.pluck('minTime')
    .distinctUntilChanged()
    .withLatestFrom(timeSource$, max);

  const maxChange$ = props$.pluck('maxTime')
    .distinctUntilChanged()
    .withLatestFrom(timeSource$, min)
    ;

  return Observable.merge(
    // order matters
    timeSource$, restrictedTimeChange$, minChange$, maxChange$)
    .distinctUntilChanged();
}

export function timelineItem(elementClass, view, sources) {
  const { DOM, props, time: timeSource$, id: id$ } = sources;
  const { timeChange$, isHighlighted$ } = intent(elementClass, DOM);
  const time$ = model(props, timeSource$, timeChange$);
  const vtree$ = view(sources, time$, isHighlighted$);
  return { DOM: vtree$, time: time$ };
}
