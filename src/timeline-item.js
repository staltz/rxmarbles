import { Observable } from 'rxjs';
import { add, compose, complement, equals, path, multiply, max, min } from 'ramda';

const mouseMove$ = Observable.fromEvent(document, 'mousemove');
const mouseUp$ = Observable.fromEvent(document, 'mouseup');

function getPxToPercentageRatio(px) {
  return (100 / px) || 0.15;
}

function intent(elementClass, DOMSource) {
  return DOMSource.select('.' + elementClass).events('mousedown')
    .map(path(['currentTarget', 'parentElement', 'clientWidth']))
    .map(getPxToPercentageRatio)
    .switchMap(pxPercentRatio =>
      mouseMove$.takeUntil(mouseUp$)
        .pluck('pageX')
        .pairwise()
        .map(([x1, x2]) => x2 - x1)
        .filter(complement(equals(0)))
        .map(multiply(pxPercentRatio))
    );
}

function model(props$, diffValue$) {
  return diffValue$.startWith(0)
    .withLatestFrom(props$.pluck('value'), add)
    .map(max(0))
    .map(min(100))
    .publishReplay(1).refCount();
}

export function timelineItem(elementClass, view, sources) {
  const { DOM, props } = sources;
  const diffValue$ = intent(elementClass, DOM);
  const value$ = model(props, diffValue$);
  const vtree$ = view(props, value$);
  return { DOM: vtree$, data: value$ };
}
