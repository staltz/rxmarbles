Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'
OperatorBox = require 'rxmarbles/views/operator-box'

#
# Exports a stream of the currently selected example.
#

selectedExampleKey$ = OperatorBox.getSelected$().startWith("concat")

selectedExample$ = selectedExampleKey$
  .map((key) ->
    example = Examples[key]
    example.key = key
    return example
  )

module.exports = {
  stream: selectedExample$
}
