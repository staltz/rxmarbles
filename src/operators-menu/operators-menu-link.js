import { a } from '@cycle/dom';

import { COLORS } from '../styles/colors';
import { DIMENS } from '../styles/dimens';


export function renderOperatorsMenuLink({ content, operator }) {
  // let highlightingArrow = span({
  //     style: {
  //       display: 'inline-block',
  //       position: 'absolute',
  //       right: DIMENS.spaceTiny}
  //   }, '\u276F'
  // );
  return a('.link',
    {
      style: {
        position: 'relative',
        display: 'block',
        color: COLORS.greyDark,
      },
      attrs: { href: `#${operator}` },
    },
    [ content ],
  );
}
