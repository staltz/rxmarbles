Rx = require 'rx'

module.exports = {
  "amb": {
    "label": "amb"
    "inputs": [
      [{t:10, d:20}, {t:20, d:40}, {t:30, d:60}, {t:45, d:80}]
      [{t:5, d:1}, {t:68, d:2}, {t:90, d:3}]
      [{t:2, d:0}, {t:76, d:0}]
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
      [{t:0, d:1}, {t:30, d:2}, {t:35, d:3}, {t:40, d:4}, {t:45, d:5}, {t:90, d:6}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].throttle(20, scheduler)
  }
  "zip": {
    "label": "zip"
    "inputs": [
      [{t:0, d:1}, {t:20, d:2}, {t:65, d:3}, {t:75, d:4}, {t:92, d:5}]
      [{t:5, d:"A"}, {t:25, d:"B"}, {t:50, d:"C"}, {t:60, d:"D"}]
    ]
    "apply": (inputs) ->
      return Rx.Observable.zip(inputs[0], inputs[1], (x,y)->"#{x.content}#{y.content}")
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