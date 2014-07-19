Rx = require 'rx'

TIME_OF_COMPLETION = 100

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
  scheduler.toDateTimeOffset = (absolute) -> Math.floor(absolute)
  scheduler.toRelative = (timeSpan) -> timeSpan
  return scheduler

getReducedStream = (stream, scheduler) ->
  subject = new Rx.BehaviorSubject([])
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .reduce((acc, x) ->
      x.time = (x.timestamp / TIME_OF_COMPLETION)*100
      delete x.timestamp
      x.id = x.value.id
      x.content = x.value.content
      delete x.value
      acc.push(x)
      return acc
    ,[])
    .subscribe((x) ->
      subject.onNext(x)
      # ignore onCompleted and onError
    )
  return subject

vtscheduler = makeScheduler()

s1 = Rx.Observable
  .interval(15, vtscheduler)
  .map(-> 2)
  .scan((x,y) -> x+y)
  .map((x) -> {content: x, id: Math.floor(Math.random()*10000)})
  .take(4)
  .publish().refCount()

s2 = Rx.Observable
  .interval(37, vtscheduler)
  .delay(2, vtscheduler)
  .map(-> 1)
  .scan((x,y) -> x+y)
  .map((x) -> {content: x, id: Math.floor(Math.random()*10000)})
  .take(2)
  .publish().refCount()

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
