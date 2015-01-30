var Cycle = require('cyclejs');
var Rx = Cycle.Rx;
var packageJson = require('package.json');
var RxPackageJson = require('cyclejs/node_modules/rx/package.json');

const DEFAULT_EXAMPLE = 'merge';

module.exports = Cycle.createModel(() => ({
  route$: Rx.Observable.fromEvent(window, 'hashchange')
    .map(hashEvent => hashEvent.target.location.hash.replace('#', ''))
    .startWith(window.location.hash.replace("#", "") || DEFAULT_EXAMPLE),
  appVersion$: Rx.Observable.just(packageJson.version),
  rxVersion$: Rx.Observable.just(RxPackageJson.version)
}));
