import {Rx} from '@cycle/core';
let packageJson = require('package');
let RxPackageJson = require('@cycle/core/node_modules/rx/package.json');

const DEFAULT_EXAMPLE = 'merge';

module.exports = function appModel() {
  let route$ = Rx.Observable.fromEvent(window, 'hashchange')
    .map(hashEvent => hashEvent.target.location.hash.replace('#', ''))
    .startWith(window.location.hash.replace('#', '') || DEFAULT_EXAMPLE);
  let appVersion$ = Rx.Observable.just(packageJson.version);
  let rxVersion$ = Rx.Observable.just(RxPackageJson.version);
  return Rx.Observable.combineLatest(
    route$, appVersion$, rxVersion$,
    (route, appVersion, rxVersion) =>
    ({route, appVersion, rxVersion})
  );
};
