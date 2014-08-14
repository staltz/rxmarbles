#
# The database of all predefined examples in the app.
#
Rx = require 'rx'
transformExamples = require 'rxmarbles/models/transform-examples'
combineExamples = require 'rxmarbles/models/combine-examples'
filterExamples = require 'rxmarbles/models/filter-examples'
mathExamples = require 'rxmarbles/models/math-examples'
booleanExamples = require 'rxmarbles/models/boolean-examples'
conditionalExamples = require 'rxmarbles/models/conditional-examples'

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
