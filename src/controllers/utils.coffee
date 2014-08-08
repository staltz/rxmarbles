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

calculateMarbleContentHash = (content) ->
  SOME_PRIME_NUMBER = 877
  contentHash = 0
  if (typeof content == "string")
    contentHash = content
      .split("")
      .map((x) -> x.charCodeAt(0))
      .reduce((x,y) -> x+y)
  else if (typeof content == "number")
    contentHash = content * SOME_PRIME_NUMBER
  return contentHash

calculateMarbleDataHash = (marbleData) ->
  SMALL_PRIME = 7
  LARGE_PRIME = 1046527
  MAX = 100000
  contentHash = calculateMarbleContentHash(marbleData.content)
  return ((marbleData.time + contentHash + SMALL_PRIME)*LARGE_PRIME) % MAX

prepareInputDiagramItem = (item) ->
  result = {}
  result.time = if typeof item.time is "undefined" then item.t else item.time
  result.content = if typeof item.content is "undefined" then item.d else item.content
  result.id = if item.id? then item.id else calculateMarbleDataHash(result)
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
    .map((x) ->
      if typeof x.value isnt "object"
        x.value = {content: x.value, id: calculateMarbleContentHash(x.value)}
      return {
        time: (x.timestamp / endTime)*100 # converts timestamp to % of endTime
        content: x.value.content
        id: x.value.id
      }
    )
    .reduce((acc, x) ->
      acc.push(x)
      return acc
    ,[])
    .subscribe((x) ->
      subject.onNext(x)
      return true
    -> console.warn("Error in the diagram promise stream") ;0
    )
  return subject.asObservable()

module.exports = {
  makeScheduler: makeScheduler
  toVTStream: toVTStream
  prepareInputDiagramStream: prepareInputDiagramStream
  prepareInputDiagram: prepareInputDiagram
  getDiagramPromise: getDiagramPromise
}
