import Rx from 'rx';
import {h, svg} from '@cycle/dom';
import Colors from '~styles/colors';
import {mergeStyles, marbleElevation1Style, textUnselectable}
  from '~styles/utils';

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

function renderSvg(data, isDraggable, inputStyle, isHighlighted) {
  let POSSIBLE_COLORS = [Colors.blue, Colors.green, Colors.yellow, Colors.red];
  let color = POSSIBLE_COLORS[data.id % POSSIBLE_COLORS.length];
  return h('svg', {
      style: {
        overflow: 'visible',
        width: inputStyle.size,
        height: inputStyle.size
      },
      attrs: {viewBox: '0 0 1 1', class: "marbleShape"},
    },
    [
      h('circle', {
        style: mergeStyles({
            stroke: Colors.black,
            fill: color
          },
          isDraggable && isHighlighted ? marbleElevation1Style : {}),
        attrs: {
          cx: 0.5, cy: 0.5, r: 0.47,
          'stroke-width': '0.06px'
        }
      })
    ]
  );
}

function renderInnerContent(data, inputStyle) {
  return h('p.marbleContent', {
    style: mergeStyles({
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        margin: '0',
        textAlign: 'center',
        lineHeight: inputStyle.size},
      textUnselectable)
  }, `${data.content}`);
}

function render(data, isDraggable, inputStyle, isHighlighted) {
  let draggableContainerStyle = {
    cursor: 'ew-resize'
  };
  const vtree = h('div.marbleRoot.diagramMarble', {
    style: mergeStyles({
      left: `${data.time}%`,
      zIndex: `${Math.round(data.time)}`
    }, createContainerStyle(inputStyle), isDraggable ? draggableContainerStyle : null),
    attrs: {'data-marble-id': data.id}
  },[
    renderSvg(data, isDraggable, inputStyle, isHighlighted),
    renderInnerContent(data, inputStyle)
  ]);
  return vtree;
}

function marbleComponent({DOM, props}) {
  let startHighlight$ = DOM.select('.marbleRoot').events('mouseenter');
  let stopHighlight$ = DOM.select('.marbleRoot').events('mouseleave');
  let data$ = props.pluck('data');
  let isDraggable$ = props.pluck('isDraggable').startWith(false);
  let style$ = props.pluck('style').startWith({});
  let isHighlighted$ = Rx.Observable.merge(
    startHighlight$.map(() => true),
    stopHighlight$.map(() => false)
  ).startWith(false);
  let vtree$ = Rx.Observable.combineLatest(
    data$, isDraggable$, style$, isHighlighted$, render
  );

  return {
    DOM: vtree$
  };
}

module.exports = marbleComponent;
