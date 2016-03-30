import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Examples from 'rxmarbles/data/examples';
import {mergeStyles, makeIsHighlighted$} from 'rxmarbles/styles/utils';

const operatorsMenuCategoryStyle = {
  textTransform: 'uppercase',
  fontSize: '0.7em',
  color: Colors.grey,
  marginTop: Dimens.spaceMedium
};

const operatorsMenuItemStyle = {
  color: Colors.greyDark,
  fontSize: '1rem',
  lineHeight: '1.6rem'
};

function renderExampleItem(example) {
  return h('li', {style: operatorsMenuItemStyle},
    h('x-operators-menu-link', {
      key: `operatorsMenuLink${example.key}`,
      href: '#' + example.key,
      content: example.key
    })
  );
}

function renderExampleItems(examples) {
  let items = [];
  for (let i = 0; i < examples.length; i++) {
    let example = examples[i];
    items.push(renderExampleItem(example));
  }
  return items;
}

function renderExampleCategory(categoryName, isFirstCategory) {
  return h('li', {
      style: mergeStyles(
        operatorsMenuCategoryStyle,
        isFirstCategory ? {marginTop: '0'} : {})},
    `${categoryName}`
  );
}

function renderMenuByCategory(categoryMap) {
  let listItems = [];
  let isFirstCategory = true;
  for (let categoryName in categoryMap) {
    if (!categoryMap.hasOwnProperty(categoryName)) continue;
    listItems.push(renderExampleCategory(categoryName, isFirstCategory));
    listItems = listItems.concat(renderExampleItems(categoryMap[categoryName]));
    isFirstCategory = false;
  }
  listItems.push(h('li', {style: operatorsMenuCategoryStyle}, 'More'));
  listItems.push(h('li', {style: operatorsMenuItemStyle}, 'Coming soon...'));
  return listItems;
}

function renderSwitchItem(key, label, isActive, isHighlighted) {
  return h('div.switch.' + key, {
    style: {
      cursor: 'pointer',
      float: 'left',
      'padding-right': '10px',
      'box-sizing': 'border-box',
      'text-align': 'left',
      color: isHighlighted ? Colors.greyDark : Colors.grey,
      'text-decoration': 'underline'
  }}, label);
}

function renderMenu(byCategory, byCategoryIsHighlighted, byAlphabetIsHighlighted) {
  let menuItemsByCategory = renderMenuByCategory(Examples.byCategory);
  let menuItemsByAlphabet = renderExampleItems(Examples.byAlphabet);
  return h('div', {}, [
    h('div',
      {style: {
        paddingRight: '36px',
        boxSizing: 'border-box',
        // 100px is the estimated header page row height
        height: 'calc(100vh - 100px)'}},
      [h('div', {},
        [ renderSwitchItem('byAlphabet', 'by Name', !byCategory, byAlphabetIsHighlighted),
          renderSwitchItem('byCategory', 'by Category', byCategory, byCategoryIsHighlighted)]),
       h('div', {style: {clear: 'both'}}),
       h('ul',
        {style: {
          margin: '0',
          'margin-top': Dimens.spaceSmall,
          padding: '0',
          listStyleType: 'none',
          overflowY: 'scroll',
          height: '100%'}}, byCategory ? menuItemsByCategory : menuItemsByAlphabet)])
    ]);
}

function operatorsMenuComponent({DOM, props}) {

  let switchMouseDown$ = DOM.get('.switch', 'mousedown');
  let showItemsByCategory$ = switchMouseDown$.map((ev) => ev.currentTarget.className.indexOf('byCategory') >= 0).startWith(true);
  let byCategoryIsHighlighted$ = makeIsHighlighted$(DOM, '.byCategory');
  let byAlphabetIsHighlighted$ = makeIsHighlighted$(DOM, '.byAlphabet');

  return {
    DOM: Rx.Observable.combineLatest(showItemsByCategory$, byCategoryIsHighlighted$, byAlphabetIsHighlighted$, renderMenu)
  };
}

module.exports = operatorsMenuComponent;
