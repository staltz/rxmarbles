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

prepareInputDiagramItem = (item) ->
  result = {}
  result.time = if typeof item.time is "undefined" then item.t else item.time
  result.content = if typeof item.content is "undefined" then item.d else item.content
  result.id = if item.id? then item.id else Math.floor(Math.random()*1000000)
  return result

prepareInputDiagram = (diagram) ->
  return (prepareInputDiagramItem(i) for i in diagram)

prepareInputDiagramStream = (diagramStream) ->
  return diagramStream.map(prepareInputDiagram)

#
# Creates an (virtual time) Rx.Observable from diagram
# data (array of data items).
#
toVTStream = (diagramData, scheduler, endTime) ->
  singleMarbleStreams = []
  for item in diagramData
    singleMarbleStreams.push(
      Rx.Observable.just(item, scheduler).delay(item.t or item.time, scheduler)
    )
  return Rx.Observable
    .merge(singleMarbleStreams)
    .takeUntilWithTime(endTime, scheduler)
    .publish().refCount()

getDiagramPromise = (stream, scheduler, endTime) ->
  subject = new Rx.BehaviorSubject([])
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map((x) -> {
      time: (x.timestamp / endTime)*100
      content: x.value.content
      id: x.value.id
    })
    .reduce((acc, x) ->
      acc.push(x)
      return acc
    ,[])
    .subscribe((x) ->
      subject.onNext(x)
      return true
    )
  return subject.asObservable()

module.exports = {
  makeScheduler: makeScheduler
  toVTStream: toVTStream
  prepareInputDiagramStream: prepareInputDiagramStream
  prepareInputDiagram: prepareInputDiagram
  getDiagramPromise: getDiagramPromise
}
