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

  const valueChange$ = element.events('mousedown')
    .map(path(['currentTarget', 'parentElement']))
    .map(getPercentageFn)
    .switchMap(getPercentage =>
      mouseMove$.takeUntil(mouseUp$)
        .pluck('pageX')
        .map(getPercentage)
        .distinctUntilChanged()
    );

  return { valueChange$, isHighlighted$ };
}

function model(props$, valueChange$) {
  const currentValue$ = props$.pluck('value');

  const restrictedValueChange$ = valueChange$
    .map(max(0))
    .map(min(100))
    .publishReplay(1).refCount();

  const minChange$ = props$.pluck('minValue')
    .distinctUntilChanged()
    .withLatestFrom(currentValue$, max);

  const maxChange$ = props$.pluck('maxValue')
    .distinctUntilChanged()
    .withLatestFrom(currentValue$, min);

  return Observable.merge(restrictedValueChange$, minChange$, maxChange$);
}

export function timelineItem(elementClass, view, sources) {
  const { DOM, props } = sources;
  const { valueChange$, isHighlighted$ } = intent(elementClass, DOM);
  const value$ = model(props, valueChange$);
  const vtree$ = view(props, value$, isHighlighted$);
  return { DOM: vtree$, data: value$ };
}
