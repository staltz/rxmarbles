import Cycle from 'cyclejs';
import Colors from 'rxmarbles/styles/colors';
import Dimens from 'rxmarbles/styles/dimens';
import Examples from 'rxmarbles/data/examples';
import {mergeStyles} from 'rxmarbles/styles/utils';
var Rx = Cycle.Rx;
var h = Cycle.h;

var OperatorsMenuModel = Cycle.createModel(() => {
  /**
   * Returns a hashmap of category headers to lists of examples in that category.
   */
  function organizeExamplesByCategory(examples) {
    var categoryMap = {};
    for (var key in examples) {
      if (!examples.hasOwnProperty(key)) continue;
      var value = examples[key];
      value.key = key;
      if (categoryMap.hasOwnProperty(value.category)) {
        categoryMap[value.category].push(value);
      } else {
        categoryMap[value.category] = [value];
      }
    }
    return categoryMap;
  };

  return {
    categoryMap$: Rx.Observable.just(organizeExamplesByCategory(Examples))
  };
});

var OperatorsMenuView = Cycle.createView(Model => {
  let operatorsMenuCategoryStyle = {
    textTransform: 'uppercase',
    fontSize: '0.7em',
    color: Colors.grey,
    marginTop: Dimens.spaceMedium
  };

  let operatorsMenuItemStyle = {
    color: Colors.greyDark,
    fontSize: '1rem',
    lineHeight: '1.6rem'
  };

  function vrenderMenuContent(categoryMap) {
    var listItems = [];
    let isFirstCategory = true;
    for (var categoryName in categoryMap) {
      if (!categoryMap.hasOwnProperty(categoryName)) continue;
      listItems.push(vrenderExampleCategory(categoryName, isFirstCategory));
      listItems = listItems.concat(vrenderExampleItems(categoryMap[categoryName]));
      isFirstCategory = false;
    }
    listItems.push(h('li', {style: operatorsMenuCategoryStyle}, 'More'));
    listItems.push(h('li', {style: operatorsMenuItemStyle}, 'Coming soon...'));
    return listItems;
  }

  function vrenderExampleCategory(categoryName, isFirstCategory) {
    return h('li', {
      style: mergeStyles(
        operatorsMenuCategoryStyle,
        isFirstCategory ? {marginTop: '0'} : {})},
      `${categoryName}`
    );
  }

  function vrenderExampleItems(examples) {
    var items = [];
    for (var i = 0; i < examples.length; i++) {
      var example = examples[i];
      items.push(vrenderExampleItem(example));
    }
    return items;
  }

  function vrenderExampleItem(example) {
    return h('li', {style: operatorsMenuItemStyle},
      h('x-operators-menu-link', {href: '#' + example.key, content: example.key})
    );
  }

  return {
    vtree$: Model.get('categoryMap$').map(categoryMap => 
      h('div',
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
            height: '100%'}},
          vrenderMenuContent(categoryMap))])
    )
  };
});

function OperatorsMenuComponent(User) {
  let Model = OperatorsMenuModel.clone();
  let View = OperatorsMenuView.clone();
  User.inject(View).inject(Model);
}

module.exports = OperatorsMenuComponent;
