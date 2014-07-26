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
      .map((x) -> {content: x, id: Math.floor(Math.random()*1000000)})
      .takeUntilWithTime(endTime, scheduler)
      .publish().refCount()
  )

#
# Creates an Rx.Observable from a diagram data (array of items data)
#
toStream = (diagramData, scheduler, endTime) ->
  singleMarbleStreams = []
  for item in diagramData
    singleMarbleStreams.push(
      Rx.Observable.just(item.d, scheduler).delay(item.t, scheduler)
    )
  return Rx.Observable
    .merge(singleMarbleStreams)
    .let(prepareInputStream(scheduler, endTime))

getDiagramPromise = (stream, scheduler, endTime) ->
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
  toStream: toStream
  getDiagramPromise: getDiagramPromise
}
