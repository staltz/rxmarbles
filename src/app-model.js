import { fromEvent } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';


const DEFAULT_EXAMPLE = 'merge';

export function appModel() {
  return fromEvent(window, 'hashchange').pipe(
    map(hashEvent => hashEvent.target.location.hash.replace('#', '')),
    startWith(window.location.hash.replace('#', '')),
    map(route => route || DEFAULT_EXAMPLE),
    distinctUntilChanged(),
    map(route => ({ route, inputs: undefined }))
  )
}
