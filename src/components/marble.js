import Cycle from 'cyclejs';
import svg from 'cyclejs/node_modules/virtual-dom/virtual-hyperscript/svg';
import Colors from 'rxmarbles/styles/colors';
import {mergeStyles, svgElevation1Style, textUnselectable}
  from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

function createContainerStyle(inputStyle) {
  return {
    width: inputStyle.size,
    height: inputStyle.size,
    position: 'relative',
    display: 'inline-block',
    margin: `calc(0px - (${inputStyle.size} / 2))`,
    bottom: `calc((100% - ${inputStyle.size}) / 2)`,
    cursor: 'default'
  };
}

function renderSvg(data, isDraggable, inputStyle, isHighlighted, isGhost) {
  let POSSIBLE_COLORS = [Colors.blue, Colors.green, Colors.yellow, Colors.red];
  let color = isGhost ? Colors.almostWhite : POSSIBLE_COLORS[data.get('id') % POSSIBLE_COLORS.length];
  return svg('svg.marbleShape', {
      style: mergeStyles({
          overflow: 'visible',
          width: inputStyle.size,
          height: inputStyle.size},
        isDraggable && isHighlighted ? svgElevation1Style : {}),
      attributes: {viewBox: '0 0 1 1'}},
    [
      svg('circle', {
        style: {
          stroke: isGhost ? Colors.greyLight : Colors.black,
          fill: color
        },
        attributes: {
          cx: 0.5, cy: 0.5, r: 0.47,
          'stroke-width': '0.06px'
        }
      })
    ]
  );
}

function renderInnerContent(data, inputStyle, isGhost) {
  var style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0',
    margin: '0',
    textAlign: 'center',
    lineHeight: inputStyle.size
  };

  if (isGhost) {
    style['color'] = Colors.greyLight;
  }

  return h('p.marbleContent', {
    style: mergeStyles(style, textUnselectable)
  }, `${data.get('content')}`);
}

function render(data, isDraggable, inputStyle, isHighlighted, isGhost) {
  let draggableContainerStyle = {
    cursor: 'ew-resize'
  };
  return h('div.marbleRoot', {
    style: mergeStyles({
        left: `${data.get('time')}%`,
        zIndex: data.get('time')},
      createContainerStyle(inputStyle),
      isDraggable ? draggableContainerStyle : null),
    attributes: {'data-marble-id': data.get('id')}
  },[
    renderSvg(data, isDraggable, inputStyle, isHighlighted, isGhost),
    renderInnerContent(data, inputStyle, isGhost)
  ]);
}

function marbleComponent(interactions, properties) {
  let startHighlight$ = interactions.get('.marbleRoot', 'mouseenter');
  let stopHighlight$ = interactions.get('.marbleRoot', 'mouseleave');
  let data$ = properties.get('data');
  let isDraggable$ = properties.get('isDraggable').startWith(false);
  let isGhost$ = properties.get('isGhost').startWith(false);
  let style$ = properties.get('style').startWith({});
  let isHighlighted$ = Rx.Observable.merge(
    startHighlight$.map(() => true),
    stopHighlight$.map(() => false)
  ).startWith(false);

  return {
    vtree$: Rx.Observable.combineLatest(
      data$, isDraggable$, style$, isHighlighted$, isGhost$, render
    )
  };
}

module.exports = marbleComponent;
