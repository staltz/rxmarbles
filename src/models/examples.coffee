Rx = require 'rx'

module.exports = {
  "merge": {
    "function": Rx.Observable.merge
    "inputs": [
      [{t:0, d:20}, {t:15, d:40}, {t:30, d:60}, {t:45, d:80}, {t:60, d:100}]
      [{t:37, d:1}, {t:68, d:1}]
    ]
  }
}