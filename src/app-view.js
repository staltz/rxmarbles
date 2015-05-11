import Cycle from 'cyclejs';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import {mergeStyles} from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

const rxmarblesGithubUrl = 'https://github.com/staltz/rxmarbles';
const rxjsGithubUrl = 'https://github.com/Reactive-Extensions/RxJS';

const pageRowWidth = '1060px';
const sandboxWidth = '820px';

const pageRowStyle = {
  position: 'relative',
  width: pageRowWidth,
  margin: '0 auto'
};

const pageRowChildStyle = {
  display: 'inline-block',
  marginLeft: `-${Dimens.spaceMedium}`
};

const pageRowFirstChildStyle = mergeStyles(pageRowChildStyle, {
  width: `calc(${pageRowWidth} - ${sandboxWidth} - ${Dimens.spaceMedium})`,
  marginRight: Dimens.spaceMedium
});

const pageRowLastChildStyle = mergeStyles(pageRowChildStyle, {
  width: sandboxWidth
});

function vrenderHeader() {
  return h('div', {style: pageRowStyle}, [
    h('h1',
      {style: mergeStyles({
        fontFamily: Fonts.fontSpecial,
        color: Colors.greyDark},
        pageRowFirstChildStyle)},
      'RxMarbles'),
    h('h3',
      {style: mergeStyles({
        color: Colors.greyDark},
        pageRowLastChildStyle)},
      'Interactive diagrams of Rx Observables')
  ]);
}

function vrenderContent(route) {
  return h('div',
    {style: mergeStyles(pageRowStyle, {marginTop: Dimens.spaceSmall})},
    [
      h('div',
        {style: pageRowFirstChildStyle},
        h('x-operators-menu', {key: 'operatorsMenu'})
      ),
      h('div',
        {style: mergeStyles({
          position: 'absolute',
          top: '0'},
          pageRowLastChildStyle)}
        ,h('x-sandbox', {key: 'sandbox', route: route, width: '820px'})
      )
    ]
  );
}

function vrenderFooter(appVersion, rxVersion) {
  return h('section', {
    style: {
      position: 'fixed',
      bottom: '2px',
      right: Dimens.spaceMedium,
      color: Colors.greyDark
    }
  }, [
    h('a', {href: `${rxmarblesGithubUrl}/releases/tag/v${appVersion}`}, `v${appVersion}`),
    ' built on ',
    h('a', {href: `${rxjsGithubUrl}/tree/v${rxVersion}`}, `RxJS v${rxVersion}`),
    ' by ',
    h('a', {href: 'https://twitter.com/andrestaltz'}, '@andrestaltz')
  ]);
}

module.exports = function appView(model) {
  return Rx.Observable.combineLatest(
    model.route$,
    model.appVersion$,
    model.rxVersion$,
    (route, appVersion, rxVersion) =>
      h('div', [
        vrenderHeader(),
        vrenderContent(route),
        vrenderFooter(appVersion, rxVersion)
      ])
  )
};
