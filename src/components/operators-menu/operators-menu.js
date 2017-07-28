import { div, li, ul } from '@cycle/dom';
import { keys, merge, toPairs } from 'ramda';

import { greyDark, DIMENS } from '../../styles';
import { categories } from '../../data';

import { renderOperatorsMenuLink } from './operators-menu-link';


const operatorsMenuCategoryStyle = merge({
  textTransform: 'uppercase',
  fontSize: '0.7em',
  marginTop: DIMENS.spaceMedium,
}, greyDark);

const operatorsMenuItemStyle = merge({
  fontSize: '1rem',
  lineHeight: '1.6rem'
}, greyDark);

const operatorsMenuStyle = {
  marginRight: DIMENS.spaceLarge,
  boxSizing: 'border-box',
  overflowY: 'scroll',
  height: 'calc(100vh - 150px)'
};

const categoryMenuStyle = {
  margin: '0',
  padding: '0',
  listStyleType: 'none',
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
