Rx = require 'rx'

module.exports = {
  "map": {
    "label": "map(x => 10 * x)"
    "inputs": [
      [{t:10, d:1}, {t:20, d:2}, {t:50, d:3}]
    ]
    "apply": (inputs) -> inputs[0].map((x) ->
      return {content: x.content*10, time: x.time, id: x.id}
    )
  }

  "filter": {
    "label": "filter(x => x > 10)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].filter((x) -> x.content > 10)
  }

  "scan": {
    "label": "scan((x, y) => x + y)"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
    ]
    "apply": (inputs) -> inputs[0].scan((x, y) ->
      return {content: x.content + y.content, time: x.time, id: x.id+y.id}
    )
  }

  "aggregate": {
    "label": "aggregate((x, y) => x + y)"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
    ]
    "apply": (inputs) -> inputs[0].aggregate((x, y) ->
      return {content: x.content + y.content, time: x.time, id: x.id+y.id}
    )
  }

  "average": {
    "label": "average"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:30, d:2}, {t:50, d:2}, {t:65, d:5}]
    ]
    "apply": (inputs) -> inputs[0].average((x) -> x.content)
  }

  "min": {
    "label": "min"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].min((x,y) ->
      return 1 if x.content > y.content
      return -1 if x.content < y.content
      return 0
    )
  }

  "max": {
    "label": "max"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].max((x,y) ->
      return 1 if x.content > y.content
      return -1 if x.content < y.content
      return 0
    )
  }

  "count": {
    "label": "count(x => x > 10)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].count((x) -> x.content > 10)
  }

  "contains": {
    "label": "contains(22)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].contains({content:22}, (x,y) -> x.content == y.content)
  }

  "all": {
    "label": "all(x => x < 10)"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
    ]
    "apply": (inputs) -> inputs[0].all((x) -> x.content < 10)
  }

  # #TODO Debug and fix
  # "sequenceEqual": {
  #   "label": "sequenceEqual"
  #   "inputs": [
  #     [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
  #     [{t:2, d:1}, {t:20, d:2}, {t:40, d:3}, {t:70, d:4}, {t:77, d:5}]
  #   ]
  #   "apply": (inputs) -> inputs[1].sequenceEqual(inputs[0], (x,y) ->
  #     return 1 if x.content > y.content
  #     return -1 if x.content < y.content
  #     return 0
  #   )
  # }

  "amb": {
    "label": "amb"
    "inputs": [
      [{t:10, d:20}, {t:20, d:40}, {t:30, d:60}]
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}]
      [{t:20, d:0}, {t:32, d:0}, {t:44, d:0}]
    ]
    "apply": (inputs) -> Rx.Observable.amb(inputs)
  }

  "concat": {
    "label": "concat"
    "inputs": [
      [{t:0, d:1}, {t:15, d:1}, {t:50, d:1}]
      [{t:13, d:2}, {t:30, d:2}]
    ]
    "apply": (inputs) -> Rx.Observable.concat(inputs)
  }

  "merge": {
    "label": "merge"
    "inputs": [
      [{t:0, d:20}, {t:15, d:40}, {t:30, d:60}, {t:45, d:80}, {t:60, d:100}]
      [{t:37, d:1}, {t:68, d:1}]
    ]
    "apply": (inputs) -> Rx.Observable.merge(inputs)
  }

  # #TODO debug and fix
  # "repeat": {
  #   "label": "repeat(3)"
  #   "inputs": [
  #     [{t:0, d:1}, {t:10, d:2}]
  #   ]
  #   "apply": (inputs) -> inputs[0].repeat(3)
  # }

  "delay": {
    "label": "delay"
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].delay(20, scheduler)
  }

  "throttle": {
    "label": "throttle"
    "inputs": [
      [{t:0, d:1}, {t:26, d:2}, {t:34, d:3}, {t:40, d:4}, {t:45, d:5}, {t:90, d:6}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].throttle(20, scheduler)
  }

  "combineLatest": {
    "label": "combineLatest"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:65, d:3}, {t:75, d:4}, {t:92, d:5}]
      [{t:10, d:"A"}, {t:25, d:"B"}, {t:50, d:"C"}, {t:57, d:"D"}]
    ]
    "apply": (inputs) ->
      return Rx.Observable.combineLatest(inputs[0], inputs[1], (x,y)->"#{x.content}#{y.content}")
  }

  "zip": {
    "label": "zip"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:65, d:3}, {t:75, d:4}, {t:92, d:5}]
      [{t:10, d:"A"}, {t:25, d:"B"}, {t:50, d:"C"}, {t:57, d:"D"}]
    ]
    "apply": (inputs) ->
      return Rx.Observable.zip(inputs[0], inputs[1], (x,y)->"#{x.content}#{y.content}")
  }

  "sample": {
    "label": "sample"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:40, d:3}, {t:60, d:4}, {t:80, d:5}]
      [{t:10, d:"A"}, {t:25, d:"B"}, {t:33, d:"C"}, {t:70, d:"D"}]
    ]
    "apply": (inputs) -> inputs[0].sample(inputs[1])
  }

  "startWith": {
    "label": "startWith(1)"
    "inputs": [
      [{t:30, d:2}, {t:40, d:3}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].startWith(scheduler, 1)
  }

  "first": {
    "label": "first"
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ]
    "apply": (inputs) -> inputs[0].first()
  }

  "last": {
    "label": "last"
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ]
    "apply": (inputs) -> inputs[0].last()
  }

  "elementAt": {
    "label": "elementAt(2)"
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].elementAt(2)
  }

  "find": {
    "label": "find(x => x > 10)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].find((x) -> x.content > 10)
  }

  "take": {
    "label": "take(2)"
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].take(2, scheduler)
  }

  "skip": {
    "label": "skip(2)"
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ]
    "apply": (inputs) -> inputs[0].skip(2)
  }

  "takeUntil": {
    "label": "takeUntil"
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}]
      [{t:47, d:0}, {t:73, d:0}]
    ]
    "apply": (inputs) -> inputs[0].takeUntil(inputs[1])
  }

  "skipUntil": {
    "label": "skipUntil"
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}]
      [{t:47, d:0}, {t:73, d:0}]
    ]
    "apply": (inputs) -> inputs[0].skipUntil(inputs[1])
  }

  "distinct": {
    "label": "distinct"
    "inputs": [
      [{t:5, d:1}, {t:20, d:2}, {t:35, d:2}, {t:60, d:1}, {t:70, d:3}]
    ]
    "apply": (inputs) -> inputs[0].distinct((x) -> x.content)
  }

  "distinctUntilChanged": {
    "label": "distinctUntilChanged"
    "inputs": [
      [{t:5, d:1}, {t:20, d:2}, {t:35, d:2}, {t:60, d:1}, {t:70, d:3}]
    ]
    "apply": (inputs) -> inputs[0].distinctUntilChanged((x) -> x.content)
  }
}