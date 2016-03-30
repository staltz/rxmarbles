import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import {mergeStyles, makeIsHighlighted$} from 'rxmarbles/styles/utils';

function operatorsMenuLink({DOM, props}) {
  let href$ = props.get('href');
  let content$ = props.get('content').startWith('');
  let isHighlighted$ = makeIsHighlighted$(DOM, '.link');
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
