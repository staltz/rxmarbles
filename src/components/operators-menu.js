import Rx from 'rx';
import {h} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Colors from '~styles/colors';
import Dimens from '~styles/dimens';
import Examples from '~data/examples';
import {mergeStyles} from '~styles/utils';
import OperatorsMenuLinkComponent from './operators-menu-link'; 

/**
 * Returns a hashmap of category headers to lists of examples in that category.
 */
function organizeExamplesByCategory(examples) {
  let categoryMap = {};
  for (let key in examples) {
    if (!examples.hasOwnProperty(key)) continue;
    let value = examples[key];
    value.key = key;
    if (categoryMap.hasOwnProperty(value.category)) {
      categoryMap[value.category].push(value);
    } else {
      categoryMap[value.category] = [value];
    }
  }
  return categoryMap;
}

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

function renderExampleItem$({ DOM, example }) {
  const link = OperatorsMenuLinkComponent({
    DOM,
    props$: Rx.Observable.of({
      key: `operatorsMenuLink${example.key}`,
      href: '#' + example.key,
      content: example.key
    })
  });
  return link.DOM.map(linkVTree => h('li', {style: operatorsMenuItemStyle}, [linkVTree]));
}

function renderExampleItems$({ DOM, examples }) {
  const vtree$s = examples
    .map(example => renderExampleItem$({ DOM, example }))
  return Rx.Observable
    .combineLatest(vtree$s, (...args) => [...args]);
}

function renderExampleCategory(categoryName, isFirstCategory) {
  return h('li', {
      style: mergeStyles(
        operatorsMenuCategoryStyle,
        isFirstCategory ? {marginTop: '0'} : {})},
    `${categoryName}`
  );
}

function renderMenuContent$({ DOM, categoryMap} ) {
  const li$s = Object.keys(categoryMap).map((categoryName, index) => {
    let header = renderExampleCategory(categoryName, index == 0)
    let examples = categoryMap[categoryName]
    return renderExampleItems$({DOM, examples})
      .map(list => [header].concat(list))
  })

  return Rx.Observable
    .combineLatest(li$s, (...args) => args.reduce((p, n) => p.concat(n), []))
    .map(list => list.concat([
      h('li', {style: operatorsMenuCategoryStyle}, 'More'),
      h('li', {style: operatorsMenuItemStyle}, 'Coming soon...')
    ]))
}

function view(listitems) {
  return h('div',
        {style: {
          paddingRight: '36px',
          boxSizing: 'border-box',
          // 100px is the estimated header page row height
          height: 'calc(100vh - 100px)'}},
        [h('ul',
          {style: {
            margin: '0',
            padding: '0',
            listStyleType: 'none',
            overflowY: 'scroll',
            height: '100%'}
          }, listitems)])
}

function operatorsMenuComponent({ DOM }) {
  const categoryMap$ = Rx.Observable.just(organizeExamplesByCategory(Examples));
  const vtree$ = categoryMap$
      .flatMap(categoryMap => renderMenuContent$({ DOM, categoryMap }))
      .map(view)

  return {
    DOM: vtree$
  };
}

module.exports = operatorsMenuComponent;
