import Cycle from 'cyclejs';
import {mergeStyles, textUnselectable, elevation1Style}
  from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

var DiagramCompletionComponentModel = Cycle.createModel((Properties, Intent) => ({
  time$: Properties.get('time$'),
  isDraggable$: Properties.get('isDraggable$').startWith(false),
  isTall$: Properties.get('isTall$').startWith(false),
  style$: Properties.get('style$').startWith({}),
  isHighlighted$: Rx.Observable.merge(
    Intent.get('startHighlight$').map(() => true),
    Intent.get('stopHighlight$').map(() => false)
  ).startWith(false)
}));

var DiagramCompletionComponentView = Cycle.createView(Model => {
  let draggableContainerStyle = {
    cursor: 'ew-resize'
  };

  function createContainerStyle(inputStyle) {
    return {
      display: 'inline-block',
      position: 'relative',
      width: `calc(8 * ${inputStyle.thickness})`,
      height: inputStyle.height,
      margin: `0 calc(-4 * ${inputStyle.thickness})`
    };
  }

  function createInnerStyle(inputStyle) {
    return {
      width: inputStyle.thickness,
      height: '50%',
      marginLeft: `calc(3.5 * ${inputStyle.thickness})`,
      marginTop: `calc(${inputStyle.height} / 4.0)`,
      backgroundColor: inputStyle.color,
    };
  }

  let innerTallStyle = {
    height: '100%',
    marginTop: 0
  };

  function vrender(time, isDraggable, isTall, inputStyle, isHighlighted) {
    let containerStyle = createContainerStyle(inputStyle);
    let innerStyle = createInnerStyle(inputStyle);
    return h('div', {
      style: mergeStyles({
        left: `${time}%`},
        containerStyle,
        isDraggable ? draggableContainerStyle : {}),
      onmousedown: 'completionMouseDown$',
      onmouseenter: 'mouseenter$',
      onmouseleave: 'mouseleave$'
    },[
      h('div', {
        style: mergeStyles(
          innerStyle,
          isDraggable && isHighlighted ? elevation1Style : null,
          isTall ? innerTallStyle : null)
      })
    ]);
  }

  return {
    vtree$: Rx.Observable.combineLatest(
      Model.get('time$'),
      Model.get('isDraggable$'),
      Model.get('isTall$'),
      Model.get('style$'),
      Model.get('isHighlighted$'),
      vrender
    )
  };
});

let DiagramCompletionComponentIntent = Cycle.createIntent(View => ({
  startHighlight$: View.get('mouseenter$').map(() => 1),
  stopHighlight$: View.get('mouseleave$').map(() => 1)
}));

module.exports = Cycle.createView(Properties => {
  let Model = DiagramCompletionComponentModel.clone();
  let View = DiagramCompletionComponentView.clone();
  let Intent = DiagramCompletionComponentIntent.clone();

  Intent.inject(View).inject(Model).inject(Properties, Intent);

  return {
    vtree$: View.get('vtree$'),
    mousedown$: View.get('completionMouseDown$')
  };
});
