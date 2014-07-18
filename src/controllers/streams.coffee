Rx = require 'rx'

#
# Streams.coffee exports the data streams used for the play interaction
#

makeScheduler = ->
  scheduler = new Rx.VirtualTimeScheduler(0, (x,y) ->
    return 1 if x > y
    return -1 if x < y
    return 0
  )
  scheduler.add = (absolute, relative) -> (absolute + relative)
  scheduler.toDateTimeOffset = (absolute) -> Math.floor(absolute/1000)
  scheduler.toRelative = (timeSpan) -> timeSpan
  return scheduler

getReducedStream = (stream, scheduler) ->
  subject = new Rx.BehaviorSubject([])
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .reduce((acc, x) ->
      acc.push(x)
      console.log(acc)
      return acc
    ,[])
    .subscribe((x) ->
      subject.onNext(x)
      # ignore onCompleted and onError
    )
  return subject

vtscheduler = makeScheduler()

s1 = Rx.Observable
  .interval(2000, vtscheduler)
  .map(-> 2)
  .scan((x,y) -> x+y)
  .take(4)

s2 = Rx.Observable
  .interval(5000, vtscheduler)
  .delay(2, vtscheduler)
  .map(-> 1)
  .scan((x,y) -> x+y)
  .take(2)

s3 = Rx.Observable.merge(s1, s2)

rs1 = getReducedStream(s1, vtscheduler)
rs2 = getReducedStream(s2, vtscheduler)
rs3 = getReducedStream(s3, vtscheduler)

vtscheduler.start()

module.exports = {
  s1: rs1
  s2: rs2
  s3: rs3
}
