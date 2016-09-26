import Rx from 'rx';
import RxMarblesVersion from '~version';
import RxVersion from '~rx-version';

const DEFAULT_EXAMPLE = 'merge';

module.exports = function appModel() {
  let route$ = Rx.Observable.fromEvent(window, 'hashchange')
    .map(hashEvent => hashEvent.target.location.hash.replace('#', ''))
    .startWith(window.location.hash.replace('#', '') || DEFAULT_EXAMPLE);
  return route$
    .map(route => (route, RxMarblesVersion, RxVersion));
};
