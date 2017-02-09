import { div, li, ul } from '@cycle/dom';
import { keys, merge, toPairs } from 'ramda';

import { COLORS } from '../../styles/colors';
import { DIMENS } from '../../styles/dimens';
import { categories } from '../../data';

import { renderOperatorsMenuLink } from './operators-menu-link';


const operatorsMenuCategoryStyle = {
  textTransform: 'uppercase',
  fontSize: '0.7em',
  color: COLORS.grey,
  marginTop: DIMENS.spaceMedium,
};

const operatorsMenuItemStyle = {
  color: COLORS.greyDark,
  fontSize: '1rem',
  lineHeight: '1.6rem'
};

const operatorsMenuStyle = {
  paddingRight: DIMENS.spaceLarge,
  boxSizing: 'border-box',
};

const categoryMenuStyle = {
  margin: '0',
  padding: '0',
  listStyleType: 'none',
  overflowY: 'scroll',
  height: '100%'
};

function renderOperatorsMenuLinkItem(operator) {
  return li(
    { style: operatorsMenuItemStyle },
    [renderOperatorsMenuLink({ operator, content: operator })],
  );
}

function renderCategoryHeader(categoryName, isFirstCategory) {
  return li({
      style: merge(
        operatorsMenuCategoryStyle,
        isFirstCategory ? { marginTop: '0' } : {}
      ),
    }, [`${categoryName}`],
  );
}

export function renderOperatorsMenu() {
  const categoryMenus = toPairs(categories)
    .map(([categoryName, examples], i) => {
      const links = keys(examples).map(renderOperatorsMenuLinkItem);

      return ul(
        { style: categoryMenuStyle },
        [
          renderCategoryHeader(categoryName, i === 0),
          ...links,
        ],
      );
    });

  return div(
    { style: operatorsMenuStyle },
    [
      ...categoryMenus,
      ul({ style: categoryMenuStyle }, [
        li({ style: operatorsMenuCategoryStyle }, 'More'),
        li({ style: operatorsMenuItemStyle }, 'Coming soon...'),
      ]),
    ],
  );
}
