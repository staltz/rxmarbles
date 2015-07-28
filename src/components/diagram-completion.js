import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {mergeStyles, textUnselectable, elevation1Style}
  from 'rxmarbles/styles/utils';

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

function diagramCompletionComponent({DOM, props}) {
  let startHighlight$ = DOM.get('.completionRoot', 'mouseenter');
  let stopHighlight$ = DOM.get('.completionRoot', 'mouseleave');
  let time$ = props.get('time').startWith(100);
  let isDraggable$ = props.get('isDraggable').startWith(false);
  let isTall$ = props.get('isTall').startWith(false);
  let style$ = props.get('style').startWith({
    thickness: '2px',
    height: '10px',
    color: 'black'
  });
  let isHighlighted$ = Rx.Observable.merge(
    startHighlight$.map(() => true),
    stopHighlight$.map(() => false)
  ).startWith(false);
  let vtree$ = Rx.Observable.combineLatest(
    time$, isDraggable$, isTall$, style$, isHighlighted$, render
  );

  return {
    DOM: vtree$
  };
}

module.exports = diagramCompletionComponent;
