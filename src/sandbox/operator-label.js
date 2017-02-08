import { div, span } from '@cycle/dom';

import { elevation2After, elevation2Before } from '../styles/utils';
import { FONTS } from '../styles/fonts';
import { DIMENS } from '../styles/dimens';

function renderOperatorLabel(label) {
  let fontSize = (label.length >= 45) ? 1.3 : (label.length >= 30) ? 1.5 : 2;
  let style = {
    fontFamily: FONTS.code,
    fontWeight: '400',
    fontSize: `${fontSize}rem`,
  };
  return span('.operatorLabel', { style }, label);
}

export function renderOperatorBox(label) {
  const style = {
    border: '1px solid rgba(0,0,0,0.06)',
    padding: DIMENS.spaceMedium,
    textAlign: 'center',
    position: 'relative',
  };
  return div('.operatorBox', { style }, [
    elevation2Before,
    renderOperatorLabel(label),
    elevation2After
  ]);
}
