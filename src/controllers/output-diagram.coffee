#
# Exports the diagram stream representing the output diagram.
#
Rx = require 'rx'
Utils = require 'rxmarbles/controllers/utils'
InputDiagrams = require 'rxmarbles/controllers/input-diagrams'
SelectedExample = require 'rxmarbles/controllers/selected-example'
Examples = require 'rxmarbles/models/examples'

MAXTIME = 100 # Time of completion

outputDiagramStream = InputDiagrams.continuous$
  .filter((x) -> x isnt null)
  .flatMapLatest((arrayOfDiagramStreams) ->
    return Rx.Observable.combineLatest(arrayOfDiagramStreams, (args...) -> args)
  )
  .combineLatest(SelectedExample.stream, (diagrams, example) ->
    vtscheduler = Utils.makeScheduler()
    inputVTStreams = (Utils.toVTStream(d, vtscheduler) for d in diagrams)
    outputVTStream = example["apply"](inputVTStreams, vtscheduler)
    # Necessary correction to include marbles at exactly 100.01
    correctedMaxTime = MAXTIME + 0.02
    outputVTStream = outputVTStream.takeUntilWithTime(correctedMaxTime, vtscheduler)
    outputDiagram = Utils.getDiagramPromise(outputVTStream, vtscheduler, MAXTIME)
    vtscheduler.start()
    return outputDiagram
  )
  .mergeAll()

module.exports = outputDiagramStream
