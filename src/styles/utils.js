import { svg } from '@cycle/dom';

const DROPSHADOW_FILTER_ID = 'dropshadow';

// Cross-browser SVG filter for drop shadows
function renderSvgDropshadow() {
  return svg({attrs: { height: '0' }}, [
    svg.filter(`#${DROPSHADOW_FILTER_ID}`, {attrs: {height: '130%'}}, [
      // stdDeviation is blur:
      svg.feGaussianBlur({attrs: {in: 'SourceAlpha', stdDeviation: '0.05'}}),
      // position relative to marble viewBox:
      svg.feOffset({attrs: {dx: '0', dy: '0.5', result: 'offsetblur'}}),
      svg.feFlood({attrs: {'flood-color': 'rgba(0,0,0,0.4)'}}),
      svg.feComposite({attrs: {in2: 'offsetblur', operator: 'in'}}),
      svg.feMerge([
        svg.feMergeNode(),
        svg.feMergeNode({attrs: {in: 'SourceGraphic'}})
      ]),
    ])
  ]);
}

const dropshadow = { filter: `url(#${DROPSHADOW_FILTER_ID})` };

export { renderSvgDropshadow, dropshadow };
