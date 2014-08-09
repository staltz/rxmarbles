#
# Exports an array of diagram streams representing the input diagrams.
#
Rx = require 'rx'
Examples = require 'rxmarbles/models/examples'
SelectedExample = require 'rxmarbles/controllers/selected-example'
Utils = require 'rxmarbles/controllers/utils'
Sandbox = require 'rxmarbles/views/sandbox'

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