import { a, div, h1, h3, section } from '@cycle/dom';

import { renderSvgDropshadow, merge } from './styles/utils';
import { flex, flex1, greyDark, fontSpecial, DIMENS } from './styles';
import { renderOperatorsMenu } from './components/operators-menu';


const appVersion = '0.0';
const rxjsVersion = '0.0';
const rxmarblesGithubUrl = 'https://github.com/staltz/rxmarbles';
const rxjsGithubUrl = 'https://github.com/ReactiveX/RxJS';

const containerWidth = { width: '1060px' };
const flexMain = { flex: '0 0 820px' };

function renderHeader() {
  const headerStyle = merge(flex, { alignItems: 'baseline' });
  return div({ style: headerStyle }, [
    h1({
      style: merge(fontSpecial, greyDark, flex1),
    }, ['RxJS Marbles']),
    h3({
      style: merge(greyDark, flexMain),
    }, ['Interactive diagrams of Rx Observables'])
  ]);
}

function renderContent(sandboxDOM) {
  return div({ style: flex }, [
    div({ style: flex1 }, [renderOperatorsMenu()]),
    div({ style: flexMain }, [sandboxDOM]),
  ]);
}

function renderFooter() {
  const style = {
    position: 'fixed',
    bottom: '2px',
    right: DIMENS.spaceMedium,
  };
  return section({ style: merge(style, greyDark) }, [
    a({ attrs: { href: `${rxmarblesGithubUrl}/releases/tag/v${appVersion}` } }, `v${appVersion}`),
    ' built on ',
    a({ attrs: { href: `${rxjsGithubUrl}/tree/v${rxjsVersion}` } }, `RxJS v${rxjsVersion}`),
    ' by ',
    a({ attrs: { href: 'https://twitter.com/andrestaltz' } }, '@andrestaltz')
  ]);
}

export function appView(sandboxDOM$) {
  return sandboxDOM$
    .map((sandboxDOM) =>
      div({ style: merge(containerWidth, { margin: '0 auto' }) }, [
        renderSvgDropshadow(),
        renderHeader(),
        renderContent(sandboxDOM),
        renderFooter(),
      ]),
    );
}
