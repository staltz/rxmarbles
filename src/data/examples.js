/*
 * The database of all predefined examples in the app.
 */
var transformExamples = require('rxmarbles/data/transform-examples');
var combineExamples = require('rxmarbles/data/combine-examples');
var filterExamples = require('rxmarbles/data/filter-examples');
var mathExamples = require('rxmarbles/data/math-examples');
var booleanExamples = require('rxmarbles/data/boolean-examples');
var conditionalExamples = require('rxmarbles/data/conditional-examples');

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

module.exports = merge(
  applyCategory(transformExamples, "Transforming Operators"),
  applyCategory(combineExamples, "Combining Operators"),
  applyCategory(filterExamples, "Filtering Operators"),
  applyCategory(mathExamples, "Mathematical Operators"),
  applyCategory(booleanExamples, "Boolean Operators"),
  applyCategory(conditionalExamples, "Conditional Operators")
);
