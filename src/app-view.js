import {h} from '@cycle/dom';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Fonts from 'rxmarbles/styles/fonts';
import {mergeStyles, renderSvgDropshadow} from 'rxmarbles/styles/utils';

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

function renderHeader() {
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

function renderContent(route) {
  const style = mergeStyles(pageRowStyle, {marginTop: Dimens.spaceSmall});
  return (
    h('div', {style}, [
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
    ])
  );
}

function renderFooter(appVersion, rxVersion) {
  const style = {
    position: 'fixed',
    bottom: '2px',
    right: Dimens.spaceMedium,
    color: Colors.greyDark
  };
  return h('section', {style}, [
    h('a', {href: `${rxmarblesGithubUrl}/releases/tag/v${appVersion}`}, `v${appVersion}`),
    ' built on ',
    h('a', {href: `${rxjsGithubUrl}/tree/v${rxVersion}`}, `RxJS v${rxVersion}`),
    ' by ',
    h('a', {href: 'https://twitter.com/andrestaltz'}, '@andrestaltz')
  ]);
}

module.exports = function appView(state$) {
  return state$.map(({route, appVersion, rxVersion}) =>
    h('div', [
      renderSvgDropshadow(),
      renderHeader(),
      renderContent(route),
      renderFooter(appVersion, rxVersion)
    ])
  );
};
