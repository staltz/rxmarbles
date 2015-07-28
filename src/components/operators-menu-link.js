import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import {mergeStyles} from 'rxmarbles/styles/utils';

function operatorsMenuLink({DOM, props}) {
  let startHighlight$ = DOM.get('.link', 'mouseenter').map(() => 1);
  let stopHighlight$ = DOM.get('.link', 'mouseleave').map(() => 1);
  let href$ = props.get('href');
  let content$ = props.get('content').startWith('');
  let isHighlighted$ = Rx.Observable.merge(
    startHighlight$.map(() => true),
    stopHighlight$.map(() => false)
  ).startWith(false);
  let highlightingArrow = h('span', {
      style: {
        display: 'inline-block',
        position: 'absolute',
        right: Dimens.spaceTiny}
    }, '\u276F'
  );
  let vtree$ = Rx.Observable.combineLatest(href$, content$, isHighlighted$,
    (href, content, isHighlighted) =>
      h('a.link', {
          style: mergeStyles({
              position: 'relative',
              display: 'block',
              color: Colors.greyDark},
            isHighlighted ? {color: Colors.black} : null),
          href: href},
        [
          content,
          isHighlighted ? highlightingArrow : null
        ]
      )
  );

  return {DOM: vtree$};
}

module.exports = operatorsMenuLink;
