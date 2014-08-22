Rx = require 'rx'

module.exports = {
  "delay": {
    "label": "delay"
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:1}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].delay(20, scheduler)
  }

  "delayWithSelector": {
    "label": "delayWithSelector(x => Rx.Observable.timer(20 * x))"
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:1}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].delayWithSelector((x) ->
      return Rx.Observable.timer(Number(x.content) * 20, 1000, scheduler)
    )
  }

  "findIndex": {
    "label": "findIndex(x => x > 10)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].findIndex((x) -> x.content > 10)
  }

  "map": {
    "label": "map(x => 10 * x)"
    "inputs": [
      [{t:10, d:1}, {t:20, d:2}, {t:50, d:3}]
    ]
    "apply": (inputs) -> inputs[0].map((x) ->
      return {content: x.content*10, time: x.time, id: x.id}
    )
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

  # "switch": {
  #   "comingsoon": true
  # }

  # #TODO debug and fix
  # "repeat": {
  #   "label": "repeat(3)"
  #   "inputs": [
  #     [{t:0, d:1}, {t:10, d:2}]
  #   ]
  #   "apply": (inputs) -> inputs[0].repeat(3)
  # }

  "throttle": {
    "label": "throttle"
    "inputs": [
      [{t:0, d:1}, {t:26, d:2}, {t:34, d:3}, {t:40, d:4}, {t:45, d:5}, {t:90, d:6}]
    ]
    "apply": (inputs, scheduler) -> inputs[0].throttle(20, scheduler)
  }
}
