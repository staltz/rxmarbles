import Cycle from 'cyclejs';
import svg from 'cyclejs/node_modules/virtual-dom/virtual-hyperscript/svg';
import Colors from 'rxmarbles/styles/colors';
import {mergeStyles, svgElevation1Style, textUnselectable}
  from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

let MarbleModel = Cycle.createModel((Properties, Intent) => ({
  data$: Properties.get('data$'),
  isDraggable$: Properties.get('isDraggable$').startWith(false),
  style$: Properties.get('style$').startWith({}),
  isHighlighted$: Rx.Observable.merge(
    Intent.get('startHighlight$').map(() => true),
    Intent.get('stopHighlight$').map(() => false)
  ).startWith(false)
}));

let MarbleView = Cycle.createView(Model => {
  let POSSIBLE_COLORS = [Colors.blue, Colors.green, Colors.yellow, Colors.red];

  let draggableContainerStyle = {
    cursor: 'ew-resize'
  };

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

  function vrenderSvg(data, isDraggable, inputStyle, isHighlighted) {
    let color = POSSIBLE_COLORS[data.get('id') % POSSIBLE_COLORS.length];
    return svg('svg', {
      style: mergeStyles({
        overflow: 'visible',
        width: inputStyle.size,
        height: inputStyle.size},
        isDraggable && isHighlighted ? svgElevation1Style : {}),
      attributes: {viewBox: '0 0 1 1'}},
      [
        svg('circle', {
          style: {
            stroke: Colors.black,
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

  function vrenderInnerContent(data, inputStyle) {
    return h('p', {
      style: mergeStyles({
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        margin: '0',
        textAlign: 'center',
        lineHeight: inputStyle.size},
        textUnselectable)
    }, `${data.get('content')}`);
  }

  function vrender(data, isDraggable, inputStyle, isHighlighted) {
    return h('div', {
      style: mergeStyles({
        left: `${data.get('time')}%`,
        zIndex: data.get('time')},
        createContainerStyle(inputStyle),
        isDraggable ? draggableContainerStyle : null),
      attributes: {'data-marble-id': data.get('id')},
      onmousedown: 'mousedown$',
      onmouseenter: 'mouseenter$',
      onmouseleave: 'mouseleave$'
    },[
      vrenderSvg(data, isDraggable, inputStyle, isHighlighted),
      vrenderInnerContent(data, inputStyle)
    ]);
  }

  return {
    vtree$: Rx.Observable.combineLatest(
      Model.get('data$'),
      Model.get('isDraggable$'),
      Model.get('style$'),
      Model.get('isHighlighted$'),
      vrender
    )
  }
});

let MarbleIntent = Cycle.createIntent(View => ({
  startHighlight$: View.get('mouseenter$').map(() => 1),
  stopHighlight$: View.get('mouseleave$').map(() => 1)
}));

module.exports = Cycle.createView(Properties => {
  let Model = MarbleModel.clone();
  let View = MarbleView.clone();
  let Intent = MarbleIntent.clone();

  Intent.inject(View).inject(Model).inject(Properties, Intent);

  return {
    vtree$: View.get('vtree$'),
    mousedown$: View.get('mousedown$')
  };
});
