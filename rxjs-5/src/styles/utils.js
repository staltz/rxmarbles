import { svg, div } from '@cycle/dom';

const DROPSHADOW_FILTER_ID = 'dropshadow';

// Cross-browser SVG filter for drop shadows
export function renderSvgDropshadow() {
  return svg({attrs: { height: '0' }}, [
    svg.filter(`#${DROPSHADOW_FILTER_ID}`, {attrs: {height: '130%'}}, [
      // stdDeviation is blur:
      svg.feGaussianBlur({attrs: {in: 'SourceAlpha', stdDeviation: '0.3'}}),
      // position relative to marble viewBox:
      svg.feOffset({attrs: {dx: '0', dy: '0.25', result: 'offsetblur'}}),
      svg.feFlood({attrs: {'flood-color': 'rgba(0,0,0,0.4)'}}),
      svg.feComposite({attrs: {in2: 'offsetblur', operator: 'in'}}),
      svg.feMerge([
        svg.feMergeNode(),
        svg.feMergeNode({attrs: {in: 'SourceGraphic'}})
      ]),
    ])
  ]);
}

export const dropshadow = { filter: `url(#${DROPSHADOW_FILTER_ID})` };

export function getElevationPseudoElementStyle(dy, blur, opacity) {
  return {
    display: 'block',
    position: 'absolute',
    left: '0', top: '0', right: '0', bottom: '0',
    '-webkit-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
       '-moz-box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
            'box-shadow': `0 ${dy} ${blur} 0 rgba(0,0,0,${opacity})`,
  };
}

export function renderElevation2Before() {
  return div(
    { style: getElevationPseudoElementStyle('2px', '10px', '0.17') }, '');
}

export function renderElevation2After() {
  return div(
    { style: getElevationPseudoElementStyle('2px', '5px', '0.26') }, '');
}

export function merge(...args) {
  return Object.assign({}, ...args);
}

export const elevation1 = {
  '-webkit-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
     '-moz-box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
          'box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.17)',
};
