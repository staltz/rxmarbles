var Cycle = require('cyclejs');
var Rx = Cycle.Rx;
var h = Cycle.h;

const rxmarblesGithubUrl = 'https://github.com/staltz/rxmarbles'
const rxjsGithubUrl = 'https://github.com/Reactive-Extensions/RxJS'

function vrenderHeader() {
  return h('div.pageRow', [
    h('h1.pageTitle', 'RxMarbles'),
    h('h3.valueProposition', 'Interactive diagrams of Rx Observables')
  ]);
}

function vrenderContent(route) {
  return h('div.pageRow', [
    h('x-operators-menu'),
    h('x-sandbox', {attributes: {route: route}})
  ]);
}

function vrenderFooter(appVersion, rxVersion) {
  return h('section.footer', [
    h('a', {href: `${rxmarblesGithubUrl}/releases/tag/v${appVersion}`}, `v${appVersion}`),
    ' built on ',
    h('a', {href: `${rxjsGithubUrl}/tree/v${rxVersion}`}, `RxJS v${rxVersion}`),
    ' by ',
    h('a', {href: 'https://twitter.com/andrestaltz'}, '@andrestaltz')
  ]);
}

module.exports = Cycle.createView(Model => ({
  vtree$: Rx.Observable.combineLatest(
    Model.get('route$'),
    Model.get('appVersion$'),
    Model.get('rxVersion$'),
    (route, appVersion, rxVersion) =>
      h('div', [
        vrenderHeader(),
        vrenderContent(route),
        vrenderFooter(appVersion, rxVersion)
      ])
  )
}));
