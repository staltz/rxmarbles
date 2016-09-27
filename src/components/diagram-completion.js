import Rx from 'rx';
import {h} from '@cycle/dom';
import {mergeStyles, textUnselectable, elevation1Style}
  from '~styles/utils';

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
  return h('div.completionRoot.diagramCompletion', {
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
  let startHighlight$ = DOM.select('.completionRoot').events('mouseenter');
  let stopHighlight$ = DOM.select('.completionRoot').events('mouseleave');
  let time$ = Rx.Observable.of(props.time);
  let isDraggable$ = Rx.Observable.of(props.isDraggable).startWith(false);
  let isTall$ = Rx.Observable.of(props.isTall).startWith(false);
  let style$ = Rx.Observable.of(props.style).startWith({
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
