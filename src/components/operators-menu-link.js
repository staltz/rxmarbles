import Cycle from 'cyclejs';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import {mergeStyles} from 'rxmarbles/styles/utils';
let Rx = Cycle.Rx;
let h = Cycle.h;

var OperatorsMenuLinkModel = Cycle.createModel((Properties, Intent) => ({
  href$: Properties.get('href$'),
  content$: Properties.get('content$').startWith(''),
  isHighlighted$: Rx.Observable.merge(
    Intent.get('startHighlight$').map(() => true),
    Intent.get('stopHighlight$').map(() => false)
  ).startWith(false)
}));

var OperatorsMenuLinkView = Cycle.createView(Model => {
  let highlightingArrow = h('span', {
    style: {
      display: 'inline-block',
      position: 'absolute',
      right: Dimens.spaceTiny}
    }, '\u276F'
  );

  return {
    vtree$: Rx.Observable.combineLatest(
      Model.get('href$'),
      Model.get('content$'),
      Model.get('isHighlighted$'),
      (href, content, isHighlighted) =>
        h('a', {
          style: mergeStyles({
            position: 'relative',
            display: 'block',
            color: Colors.greyDark},
            isHighlighted ? {color: Colors.black} : null),
          href: href,
          onmouseenter: 'mouseenter$',
          onmouseleave: 'mouseleave$'},
          [
            content,
            isHighlighted ? highlightingArrow : null
          ]
        )
    )
  };
});

let OperatorsMenuLinkIntent = Cycle.createIntent(View => ({
  startHighlight$: View.get('mouseenter$').map(() => 1),
  stopHighlight$: View.get('mouseleave$').map(() => 1)
}));

module.exports = Cycle.createView(Properties => {
  let Model = OperatorsMenuLinkModel.clone();
  let View = OperatorsMenuLinkView.clone();
  let Intent = OperatorsMenuLinkIntent.clone();

  Intent.inject(View).inject(Model).inject(Properties, Intent);

  return {
    vtree$: View.get('vtree$')
  };
});
