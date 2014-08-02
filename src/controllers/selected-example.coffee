Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'

#
# Exports a stream of the currently selected example.
#

selectedExampleKey$ = Rx.Observable.just("concat")

selectedExample$ = selectedExampleKey$
  .map((key) ->
    example = Examples[key]
    example.key = key
    return example
  )

module.exports = {
  stream: selectedExample$
}
