import Immutable from 'immutable';
import {h, svg} from '@cycle/dom';

let isTruthy = x => !!x;

function mergeStyles(...styleObjects) {
  return styleObjects.filter(isTruthy).reduce((styleA, styleB) => {
    let mapA = Immutable.Map(styleA);
    let mapB = Immutable.Map(styleB);
    return mapA.merge(mapB).toObject(); // notice B first
  }, {});
}

const DROPSHADOW_FILTER_ID = 'dropshadow';

// Cross-browser SVG filter for drop shadows
function renderSvgDropshadow() {
  return svg('svg', {attributes: {height: '0'}}, [
    svg('filter#' + DROPSHADOW_FILTER_ID, {attributes: {height: '130%'}}, [
      // stdDeviation is blur:
      svg('feGaussianBlur', {attributes: {in: 'SourceAlpha', stdDeviation: '0.05'}}),
      // position relative to marble viewBox:
      svg('feOffset', {attributes: {dx: '0', dy: '0.05', result: 'offsetblur'}}),
      svg('feFlood', {attributes: {'flood-color': 'rgba(0,0,0,0.4)'}}),
      svg('feComposite', {attributes: {in2: 'offsetblur', operator: 'in'}}),
      svg('feMerge', [
        svg('feMergeNode'),
        svg('feMergeNode', {attributes: {in: 'SourceGraphic'}})
      ])
    ])
  ]);
}

const marbleElevation1Style = {
  filter: 'url(#' + DROPSHADOW_FILTER_ID + ')'
};

const elevation1Style = {
  '-webkit-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
     '-moz-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
          'box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)'
};

const elevation2Style = {
  position: 'relative'
};

function getElevationPseudoElementStyle(dy, blur, opacity) {
  return {
    display: 'block',
    position: 'absolute',
    left: '0', top: '0', right: '0', bottom: '0',
    '-webkit-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
       '-moz-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
            'box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`
  };
}

const elevation2Before = h('div', {style:
  getElevationPseudoElementStyle('2px', '10px', '0.17')
}, '');
const elevation2After = h('div', {style:
  getElevationPseudoElementStyle('2px', '5px', '0.26')
}, '');

const elevation3Before = h('div', {style:
  getElevationPseudoElementStyle('6px', '20px', '0.19')
}, '');
const elevation3After = h('div', {style:
  getElevationPseudoElementStyle('6px', '17px', '0.2')
}, '');

const textUnselectable = {
  '-webkit-user-select': 'none',
   '-khtml-user-select': 'none',
     '-moz-user-select': 'none',
       '-o-user-select': 'none',
          'user-select': 'none'
};

export default {
  mergeStyles,
  elevation1Style,
  elevation2Style,
  elevation2Before,
  elevation2After,
  elevation3Before,
  elevation3After,
  marbleElevation1Style,
  renderSvgDropshadow,
  textUnselectable
};
