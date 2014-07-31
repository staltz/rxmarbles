Rx = require 'rx'
Utils = require 'rxmarbles/controllers/utils'
InputDiagrams = require 'rxmarbles/controllers/input-diagrams'
Examples = require 'rxmarbles/models/examples'

END = 100 # Time of completion

#
# Exports the diagram stream representing the output diagram.
#

example = Examples["merge"] # TODO generalize me

outputDiagramStream = Rx.Observable
  .combineLatest(InputDiagrams[0], InputDiagrams[1], (args...) -> args)
  .map((diagrams) ->
    vtscheduler = Utils.makeScheduler()
    inputVTStreams = (Utils.toVTStream(d, vtscheduler, END+1) for d in diagrams)
    outputVTStream = Rx.Observable.merge(inputVTStreams[0], inputVTStreams[1])
    outputDiagram = Utils.getDiagramPromise(outputVTStream, vtscheduler, END+1)
    vtscheduler.start()
    return outputDiagram
  )
  .mergeAll()

module.exports = outputDiagramStream
