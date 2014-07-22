Rx = require 'rx'

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

prepareInputStream = (scheduler, endTime) ->
  return ((stream) ->
    return stream
      .map((x) -> {content: x, id: Math.floor(Math.random()*10000)})
      .takeUntilWithTime(endTime, scheduler)
      .publish().refCount()
  )

getSerializedStreamPromise = (stream, scheduler, endTime) ->
  subject = new Rx.BehaviorSubject([])
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map((x) -> {
      time: (x.timestamp / endTime)*100
      id: x.value.id
      content: x.value.content
    })
    .reduce((acc, x) ->
      acc.push(x)
      return acc
    ,[])
    .subscribe((x) ->
      subject.onNext(x)
      # ignore onCompleted and onError
    )
  return subject

module.exports = {
  makeScheduler: makeScheduler
  prepareInputStream: prepareInputStream
  getSerializedStreamPromise: getSerializedStreamPromise
}
