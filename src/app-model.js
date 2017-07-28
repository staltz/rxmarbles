import { Observable } from 'rxjs';


const DEFAULT_EXAMPLE = 'merge';

export function appModel() {
  return Observable.fromEvent(window, 'hashchange')
    .map(hashEvent => hashEvent.target.location.hash.replace('#', ''))
    .startWith(window.location.hash.replace('#', ''))
    .map(route => route || DEFAULT_EXAMPLE)
    .distinctUntilChanged()
    .map(route => ({ route, inputs: undefined }));
};
