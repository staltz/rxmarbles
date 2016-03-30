/*
 * The database of all predefined examples in the app.
 */
var transformExamples = require('rxmarbles/data/transform-examples');
var combineExamples = require('rxmarbles/data/combine-examples');
var filterExamples = require('rxmarbles/data/filter-examples');
var mathExamples = require('rxmarbles/data/math-examples');
var booleanExamples = require('rxmarbles/data/boolean-examples');
var conditionalExamples = require('rxmarbles/data/conditional-examples');
var sortBy = require('lodash/sortBy');

function merge() {
  var args = (1 <= arguments.length) ? Array.prototype.slice.call(arguments) : [];
  var result = {};
  for (var i = 0; i < args.length; i++) {
    var object = args[i];
    for (var name in object) {
      if (!object.hasOwnProperty(name)) continue;
      result[name] = object[name];
    }
  }
  return result;
};

function applyCategory(examples, categoryName) {
  for (var key in examples) {
    if (!examples.hasOwnProperty(key)) continue;
    examples[key]["category"] = categoryName;
  }
  return examples;
};

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

function organizeExamplesByAlphabet(examples) {
  let array = [];
  for (let key in examples) {
    if (!examples.hasOwnProperty(key)) continue;
    let value = examples[key];
    array.push(value);
  }
  return sortBy(array, 'key');
}

let examples = merge(
  applyCategory(transformExamples, "Transforming Operators"),
  applyCategory(combineExamples, "Combining Operators"),
  applyCategory(filterExamples, "Filtering Operators"),
  applyCategory(mathExamples, "Mathematical Operators"),
  applyCategory(booleanExamples, "Boolean Operators"),
  applyCategory(conditionalExamples, "Conditional Operators")
);

examples.byCategory = organizeExamplesByCategory(examples);
examples.byAlphabet = organizeExamplesByAlphabet(examples);

module.exports = examples;
