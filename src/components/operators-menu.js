var Cycle = require('cyclejs');
var Rx = Cycle.Rx;
var h = Cycle.h;
var Examples = require('rxmarbles/data/examples');

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

function vrenderMenuContent(categoryMap) {
  var listItems = [];
  for (var categoryName in categoryMap) {
    if (!categoryMap.hasOwnProperty(categoryName)) continue;
    listItems.push(vrenderExampleCategory(categoryName));
    listItems = listItems.concat(vrenderExampleItems(categoryMap[categoryName]));
  }
  listItems.push(h('li.operatorsMenu-category', 'More'));
  listItems.push(h('li.operatorsMenu-item', 'Coming soon...'));
  return listItems;
};

function vrenderExampleCategory(categoryName) {
  return h('li.operatorsMenu-category', '' + categoryName);
};

function vrenderExampleItems(examples) {
  var items = [];
  for (var i = 0; i < examples.length; i++) {
    var example = examples[i];
    items.push(vrenderExampleItem(example));
  }
  return items;
};

function vrenderExampleItem(example) {
  return h('li.operatorsMenu-item', [
    h('a', {href: '#' + example.key}, example.key)
  ]);
};

module.exports = Cycle.createView(() => {
  var Model = Cycle.createModel(() => ({
    categoryMap$: Rx.Observable.just(organizeExamplesByCategory(Examples))
  }));

  var View = Cycle.createView(Model => ({
    vtree$: Model.get('categoryMap$')
      .map(categoryMap => 
        h('div.operatorsMenu-container', [
          h('ul.operatorsMenu', vrenderMenuContent(categoryMap))
        ])
      )
  }));

  View.inject(Model);

  return {
    vtree$: View.get('vtree$')
  };
});
