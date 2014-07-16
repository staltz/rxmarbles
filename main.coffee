Rx = require 'rx'

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

vtscheduler = makeScheduler()

s1 = Rx.Observable
  .interval(2000, vtscheduler)
  .map(-> 2)
  .scan((x,y) -> x+y)
  .take(4)

s2 = Rx.Observable
  .interval(5000, vtscheduler)
  #.delay(8, vtscheduler)
  .map(-> 1)
  .scan((x,y) -> x+y)
  .take(2)

printStream = (stream, scheduler) ->
  output = "------------------------------->"
  stream
    .observeOn(scheduler)
    .timestamp(scheduler)
    .subscribe((x) -> # onNext
      i = x.timestamp
      output = output.slice(0,i-1) + String(x.value) + output.slice(i)
      true
    -> # onError
    -> # onCompleted
      end = scheduler.now() + 1
      output = output.slice(0,end-1) + '|>'
      console.log(output)
      true
    )

printStream(s1, vtscheduler)
printStream(s2, vtscheduler)
printStream(Rx.Observable.merge(s1,s2), vtscheduler)
vtscheduler.start()
