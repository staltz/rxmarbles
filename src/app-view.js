import {h} from '@cycle/dom';
import Colors from '~styles/colors';
import Dimens from '~styles/dimens';
import Fonts from '~styles/fonts';
import Rx from 'rx';
import {mergeStyles, renderSvgDropshadow} from '~styles/utils';
import {
  SandboxComponent,
  DiagramComponent,
  MarbleComponent,
  DiagramCompletionComponent 
} from './lib';

import debugHook from '~rx-debug';
debugHook();

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
};

const pageRowFirstChildStyle = mergeStyles(pageRowChildStyle, {
  width: `calc(${pageRowWidth} - ${sandboxWidth} - ${Dimens.spaceMedium})`,
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

function renderContent(sandboxVTree) {
  const style = mergeStyles(pageRowStyle, {marginTop: Dimens.spaceSmall});
  return (
    h('div', {style}, [
      h('div',
        {style: pageRowFirstChildStyle},
        []//h('x-operators-menu', {key: 'operatorsMenu'})]
      ),
      h('div',
        {style: mergeStyles({
          position: 'absolute',
          top: '0'},
          pageRowLastChildStyle)},
        [sandboxVTree]
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

module.exports = function appView(sources, state$) {
  const wrapperStyle = {
    paddingLeft:  Dimens.spaceSmall,
    paddingRight: `calc(${Dimens.spaceHuge} + ${Dimens.spaceSmall})`,
  }

  const sandbox = SandboxComponent({ 
      DOM: sources.DOM,
      props$: state$
        .flatMap(({route}) => Rx.Observable.of({
          key: 'sandbox', route: route, width: '820px'
        }))
    })
    
  return Rx.Observable
  .combineLatest(state$, sandbox.DOM, (state, sandbox) => ({state, sandbox}))
  .map(({state, sandbox}) => {
    let {route, appVersion, rxVersion} = state
    return h('div', {style: wrapperStyle}, [
      renderSvgDropshadow(),
      renderHeader(),
      renderContent(sandbox),
      renderFooter(appVersion, rxVersion)
    ])
  });
};
