import Cycle from 'cyclejs';
import {mergeStyles, textUnselectable, elevation1Style}
  from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

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
    backgroundColor: inputStyle.color
  };
}

function render(time, isDraggable, isTall, inputStyle, isHighlighted) {
  let draggableContainerStyle = {
    cursor: 'ew-resize'
  };
  let innerTallStyle = {
    height: '100%',
    marginTop: 0
  };
  let containerStyle = createContainerStyle(inputStyle);
  let innerStyle = createInnerStyle(inputStyle);
  return h('div.completionRoot', {
    style: mergeStyles({
        left: `${time}%`},
      containerStyle,
      isDraggable ? draggableContainerStyle : {})
  },[
    h('div.completionInner', {
      style: mergeStyles(
        innerStyle,
        isDraggable && isHighlighted ? elevation1Style : null,
        isTall ? innerTallStyle : null)
    })
  ]);
}

function diagramCompletionComponent(interactions, properties) {
  let startHighlight$ = interactions.get('.completionRoot', 'mouseenter');
  let stopHighlight$ = interactions.get('.completionRoot', 'mouseleave');
  let time$ = properties.get('time').startWith(100);
  let isDraggable$ = properties.get('isDraggable').startWith(false);
  let isTall$ = properties.get('isTall').startWith(false);
  let style$ = properties.get('style').startWith({
    thickness: '2px',
    height: '10px',
    color: 'black'
  });
  let isHighlighted$ = Rx.Observable.merge(
    startHighlight$.map(() => true),
    stopHighlight$.map(() => false)
  ).startWith(false);

  return {
    vtree$: Rx.Observable.combineLatest(
      time$, isDraggable$, isTall$, style$, isHighlighted$, render
    )
  };
}

module.exports = diagramCompletionComponent;
