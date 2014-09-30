#
# The database of all predefined examples in the app.
#
Rx = require 'rx'
transformExamples = require 'rxmarbles/data/transform-examples'
combineExamples = require 'rxmarbles/data/combine-examples'
filterExamples = require 'rxmarbles/data/filter-examples'
mathExamples = require 'rxmarbles/data/math-examples'
booleanExamples = require 'rxmarbles/data/boolean-examples'
conditionalExamples = require 'rxmarbles/data/conditional-examples'

merge = (args...) ->
  result = {}
  for object in args
    for own name,value of object
      result[name] = object[name]
  return result

applyCategory = (examples, categoryName) ->
  for own key,value of examples
    examples[key]["category"] = categoryName
  return examples

module.exports = merge(
  applyCategory(transformExamples, "Transforming Operators"),
  applyCategory(combineExamples, "Combining Operators"),
  applyCategory(filterExamples, "Filtering Operators"),
  applyCategory(mathExamples, "Mathematical Operators"),
  applyCategory(booleanExamples, "Boolean Operators"),
  applyCategory(conditionalExamples, "Conditional Operators"),
)
