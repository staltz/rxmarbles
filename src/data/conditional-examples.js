import {Rx} from '@cycle/core';

module.exports = {
  "amb": {
    "label": "amb(a, b, c)",
    "inputs": [
      [{t:10, d:20}, {t:20, d:40}, {t:30, d:60}],
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}],
      [{t:20, d:0}, {t:32, d:0}, {t:44, d:0}]
    ],
    "apply": function(inputs) {
      return Rx.Observable.amb(inputs);
    }
  },

  "repeat": {
    "label": "a.repeat()",
    "inputs": [
      [{t: 5, d: 1}, {t: 10, d: 2}, {t: 20, d: 3}, 35]
    ],
    "apply": function (inputs) {
      return inputs[0].repeat();
    }
  }
};
