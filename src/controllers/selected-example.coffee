Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'
OperatorsMenu = require 'rxmarbles/views/operators-menu'

#
# Exports a stream of the currently selected example.
#

urlHash = window.location.hash.replace("#","") or "merge"
selectedExampleKey$ = OperatorsMenu.getSelected$().startWith(urlHash)

selectedExample$ = selectedExampleKey$
  .map((key) ->
    example = Examples[key]
    example.key = key
    return example
  )

module.exports = {
  stream: selectedExample$
}
