#
# Conversion from virtual time streams out to diagram data, and
# vice-versa, and related functions.
#
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

calculateNotificationContentHash = (content) ->
  if (typeof content == "string")
    return content.split("")
      .map((x) -> x.charCodeAt(0))
      .reduce((x,y) -> x+y)
  else if (typeof content == "number")
    SOME_PRIME_NUMBER = 877
    return content * SOME_PRIME_NUMBER

calculateNotificationHash = (marbleData) ->
  SMALL_PRIME = 7
  LARGE_PRIME = 1046527
  MAX = 100000
  contentHash = calculateNotificationContentHash(marbleData.content)
  return ((marbleData.time + contentHash + SMALL_PRIME)*LARGE_PRIME) % MAX

justIncomplete = (item, scheduler) ->
  return new Rx.AnonymousObservable((observer) ->
    return scheduler.schedule( -> observer.onNext(item) ;0 )
  )

#
# Creates an (virtual time) Rx.Observable from diagram
# data (array of data items).
#
toVTStream = (diagramData, scheduler) ->
  singleMarbleStreams = []
  for item in diagramData
    singleMarbleStreams.push(
      justIncomplete(item, scheduler).delay(item.t or item.time, scheduler)
    )
  # Necessary correction to include marbles at time exactly diagramData.end:
  correctedEndTime = diagramData.end + 0.01
  return Rx.Observable
    .merge(singleMarbleStreams)
    .takeUntilWithTime(correctedEndTime, scheduler)
    .publish().refCount()

getDiagramPromise = (stream, scheduler, maxTime) ->
  diagram = []
  subject = new Rx.BehaviorSubject([])
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .map((x) ->
      if typeof x.value isnt "object"
        x.value = {content: x.value, id: calculateNotificationContentHash(x.value)}
      return {
        time: (x.timestamp / maxTime)*100 # converts timestamp to % of maxTime
        content: x.value.content
        id: x.value.id
      }
    )
    .reduce((acc, x) ->
      acc.push(x)
      return acc
    ,[])
    .subscribe((x) -> # onNext
      diagram = x
      subject.onNext(diagram)
      return true
    -> # onError
      console.warn("Error in the diagram promise stream") ;0
    -> # onComplete
      diagram.end = scheduler.now()
      return true
    )
  return subject.asObservable()

module.exports = {
  makeScheduler: makeScheduler
  toVTStream: toVTStream
  calculateNotificationHash: calculateNotificationHash
  getDiagramPromise: getDiagramPromise
}
