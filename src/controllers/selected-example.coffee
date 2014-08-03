Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'
FunctionBox = require 'rxmarbles/views/function-box'

#
# Exports a stream of the currently selected example.
#

selectedExampleKey$ = FunctionBox.getSelected$().startWith("concat")

selectedExample$ = selectedExampleKey$
  .map((key) ->
    example = Examples[key]
    example.key = key
    return example
  )

module.exports = {
  stream: selectedExample$
}
