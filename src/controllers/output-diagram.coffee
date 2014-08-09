#
# Exports the diagram stream representing the output diagram.
#
Rx = require 'rx'
Utils = require 'rxmarbles/controllers/utils'
InputDiagrams = require 'rxmarbles/controllers/input-diagrams'
SelectedExample = require 'rxmarbles/controllers/selected-example'
Examples = require 'rxmarbles/models/examples'

END = 100 # Time of completion

outputDiagramStream = InputDiagrams.continuous$
  .filter((x) -> x isnt null)
  .flatMapLatest((arrayOfDiagramStreams) ->
    return Rx.Observable.combineLatest(arrayOfDiagramStreams, (args...) -> args)
  )
  .combineLatest(SelectedExample.stream, (diagrams, example) ->
    endTime = END+1
    vtscheduler = Utils.makeScheduler()
    inputVTStreams = (Utils.toVTStream(d, vtscheduler, endTime) for d in diagrams)
    outputVTStream = example["apply"](inputVTStreams, vtscheduler)
    outputVTStream = outputVTStream.takeUntilWithTime(endTime, vtscheduler)
    outputDiagram = Utils.getDiagramPromise(outputVTStream, vtscheduler, endTime)
    vtscheduler.start()
    return outputDiagram
  )
  .mergeAll()

module.exports = outputDiagramStream
