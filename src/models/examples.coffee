Rx = require 'rx'

module.exports = {
  "amb": {
    "function": Rx.Observable.amb
    "inputs": [
      [{t:10, d:20}, {t:20, d:40}, {t:30, d:60}, {t:45, d:80}]
      [{t:5, d:1}, {t:68, d:2}, {t:90, d:3}]
      [{t:2, d:0}, {t:76, d:0}]
    ]
  }
  "merge": {
    "function": Rx.Observable.merge
    "inputs": [
      [{t:0, d:20}, {t:15, d:40}, {t:30, d:60}, {t:45, d:80}, {t:60, d:100}]
      [{t:37, d:1}, {t:68, d:1}]
    ]
  }
  "concat": {
    "function": Rx.Observable.concat
    "inputs": [
      [{t:0, d:1}, {t:15, d:1}, {t:50, d:2}]
      [{t:13, d:2}, {t:30, d:2}]
    ]
  }
}