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

rs1 = Utils.getSerializedStreamPromise(s1, vtscheduler, TIME_OF_COMPLETION)
rs2 = Utils.getSerializedStreamPromise(s2, vtscheduler, TIME_OF_COMPLETION)
rs3 = Utils.getSerializedStreamPromise(s3, vtscheduler, TIME_OF_COMPLETION)

vtscheduler.start()

module.exports = {
  inputStreams: [rs1, rs2]
  outputStream: rs3
}
