import Rx from 'rx';
import {h} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Colors from '~styles/colors';
import Dimens from '~styles/dimens';
import {mergeStyles} from '~styles/utils';

function operatorsMenuLink({DOM, props$}) {
  let startHighlight$ = DOM.select('.link').events('mouseenter').map(() => 1);
  let stopHighlight$ = DOM.select('.link').events('mouseleave').map(() => 1);
  let href$ = props$.pluck('href').startWith('');
  let content$ = props$.pluck('content').startWith('');
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
          props: { href } 
        }, [
          content,
          isHighlighted ? highlightingArrow : null
        ]
      )
  );

  return {DOM: vtree$};
}

module.exports = sources => isolate(operatorsMenuLink)(sources);
