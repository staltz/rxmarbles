var Rx = require('cyclejs').Rx;

module.exports = {
  "amb": {
    "label": "amb",
    "inputs": [
      [{t:10, d:20}, {t:20, d:40}, {t:30, d:60}],
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}],
      [{t:20, d:0}, {t:32, d:0}, {t:44, d:0}]
    ],
    "apply": function(inputs) {
      return Rx.Observable.amb(inputs);
    }
  }
};
