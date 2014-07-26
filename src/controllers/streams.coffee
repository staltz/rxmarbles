Rx = require 'rx'
Utils = require 'rxmarbles/controllers/utils'
Examples = require 'rxmarbles/models/examples'

END = 100 # Time of completion

#
# Streams.coffee exports the data streams used for the play interaction
#

vtscheduler = Utils.makeScheduler()

inputStream1 = Utils.toStream(Examples["merge"]["inputs"][1], vtscheduler, END)
inputStream0 = Utils.toStream(Examples["merge"]["inputs"][0], vtscheduler, END)
outputStream = Rx.Observable.merge(inputStream0, inputStream1)

diagram0 = Utils.getDiagramPromise(inputStream0, vtscheduler, END)
diagram1 = Utils.getDiagramPromise(inputStream1, vtscheduler, END)
outputDiagram = Utils.getDiagramPromise(outputStream, vtscheduler, END)

vtscheduler.start()

module.exports = {
  inputDiagrams: [diagram0, diagram1]
  outputDiagram: outputDiagram
}
