/*
 * Renders a scrollable list of operators to be demonstrated on the sandbox.
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var replicate = require('rxmarbles/utils').replicate;

var inputExamples$ = new Rx.BehaviorSubject();
var click$ = new Rx.Subject();

function observe(model) {
  replicate(model.examples$, inputExamples$);
};

function renderMenuContent(examples) {
  var listItems = [];
  var categoryMap = organizeExamplesByCategory(examples);
  for (var categoryName in categoryMap) {
    if (!categoryMap.hasOwnProperty(categoryName)) continue;
    listItems.push(renderExampleCategory(categoryName));
    listItems = listItems.concat(renderExampleItems(categoryMap[categoryName]));
  }
  listItems.push(h("li.operatorsMenu-category", "More"));
  listItems.push(h("li.operatorsMenu-item", "Coming soon..."));
  return listItems;
};

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

function renderExampleCategory(categoryName) {
  return h("li.operatorsMenu-category", "" + categoryName);
};

function renderExampleItems(examples) {
  var items = [];
  for (var i = 0; i < examples.length; i++) {
    var example = examples[i];
    items.push(renderExampleItem(example));
  }
  return items;
};

function renderExampleItem(example) {
  return h("li.operatorsMenu-item", [
    h("a",
      {
        "href": "#" + example.key,
        "ev-click": function(ev) { return click$.onNext(ev);}
      },
      example.key
    )
  ]);
};

var vtree$ = inputExamples$
    .map(function(examples) {
      var listElement = h("ul.operatorsMenu", renderMenuContent(examples));
      return listElement;
    });

module.exports = {
  observe: observe,
  click$: click$,
  vtree$: vtree$
};
