Rx = require 'rx'

module.exports = {
  "combineLatest": {
    "label": "combineLatest((x, y) => \"\" + x + y)"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:65, d:3}, {t:75, d:4}, {t:92, d:5}]
      [{t:10, d:"A"}, {t:25, d:"B"}, {t:50, d:"C"}, {t:57, d:"D"}]
    ]
    "apply": (inputs) ->
      return Rx.Observable.combineLatest(inputs[0], inputs[1], (x,y)->"#{x.content}#{y.content}")
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

  "zip": {
    "label": "zip"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:65, d:3}, {t:75, d:4}, {t:92, d:5}]
      [{t:10, d:"A"}, {t:25, d:"B"}, {t:50, d:"C"}, {t:57, d:"D"}]
    ]
    "apply": (inputs) ->
      return Rx.Observable.zip(inputs[0], inputs[1], (x,y)->"#{x.content}#{y.content}")
  }
}
