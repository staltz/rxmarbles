Rx = require 'rx'
Utils = require 'rxmarbles/controllers/utils'

TIME_OF_COMPLETION = 100

#
# Streams.coffee exports the data streams used for the play interaction
#

vtscheduler = Utils.makeScheduler()

s1 = Rx.Observable
  .interval(15, vtscheduler)
  .startWith(vtscheduler,2)
  .map(-> 2)
  .scan((x,y) -> x+y)
  .let(Utils.prepareInputStream(vtscheduler, TIME_OF_COMPLETION))

s2 = Rx.Observable
  .interval(33, vtscheduler)
  .delay(2, vtscheduler)
  .map(-> 1)
  .scan((x,y) -> x+y)
  .take(2)
  .let(Utils.prepareInputStream(vtscheduler, TIME_OF_COMPLETION))

s3 = Rx.Observable.merge(s1, s2)

rs1 = Utils.getDiagramPromise(s1, vtscheduler, TIME_OF_COMPLETION)
rs2 = Utils.getDiagramPromise(s2, vtscheduler, TIME_OF_COMPLETION)
rs3 = Utils.getDiagramPromise(s3, vtscheduler, TIME_OF_COMPLETION)

vtscheduler.start()

module.exports = {
  inputDiagrams: [rs1, rs2]
  outputDiagram: rs3
}
