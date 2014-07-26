Rx = require 'rx'

module.exports = {
  "merge": {
    "function": Rx.Observable.merge
    "inputs": [
      [{t:0, d:2}, {t:15, d:4}, {t:30, d:6}, {t:45, d:8}, {t:60, d:10}]
      [{t:37, d:1}, {t:68, d:1}]
    ]
  }
}