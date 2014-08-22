Rx = require 'rx'

module.exports = {
  "all": {
    "label": "all(x => x < 10)"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
    ]
    "apply": (inputs) -> inputs[0].all((x) -> x.content < 10)
  }

  "any": {
    "label": "any(x => x > 10)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].any((x) -> x.content > 10)
  }

  "contains": {
    "label": "contains(22)"
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ]
    "apply": (inputs) -> inputs[0].contains({content:22}, (x,y) -> x.content == y.content)
  }

  # "isEmpty": {
  #   "label": "isEmpty"
  #   "inputs": [
  #     []
  #   ]
  #   "apply": (inputs) -> inputs[0].isEmpty()
  # }

  "sequenceEqual": {
    "label": "sequenceEqual"
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
      [{t:2, d:1}, {t:20, d:2}, {t:40, d:3}, {t:70, d:4}, {t:77, d:5}]
    ]
    "apply": (inputs) -> inputs[0].sequenceEqual(inputs[1], (x,y) ->
      return (x.content == y.content)
    )
  }
}