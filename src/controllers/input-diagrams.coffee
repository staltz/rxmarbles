Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'
SelectedExample = require 'rxmarbles/controllers/selected-example'
Utils = require 'rxmarbles/controllers/utils'
Sandbox = require 'rxmarbles/views/sandbox'

#
# Exports an array of diagram streams representing the input diagrams.
#

arrayOfInitialInputDiagrams$ = new Rx.BehaviorSubject(null)
SelectedExample.stream
  .map((example) ->
    return example["inputs"].map(Utils.prepareInputDiagram)
  )
  .subscribe((x) ->
    arrayOfInitialInputDiagrams$.onNext(x)
    return true
  )

continuous$ = Sandbox.getStreamOfArrayOfLiveInputDiagramStreams()

module.exports = {
  initial$: arrayOfInitialInputDiagrams$
  continuous$: continuous$
}