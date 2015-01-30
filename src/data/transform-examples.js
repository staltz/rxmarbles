var Rx = require('cyclejs').Rx;

module.exports = {
  "delay": {
    "label": "delay",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:1}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].delay(20, scheduler);
    }
  },

  "delayWithSelector": {
    "label": "delayWithSelector(x => Rx.Observable.timer(20 * x))",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:1}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].delayWithSelector(x =>
        Rx.Observable.timer(Number(x.get('content')) * 20, 1000, scheduler)
      );
    }
  },

  "findIndex": {
    "label": "findIndex(x => x > 10)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].findIndex(x => (x.get('content') > 10));
    }
  },

  "map": {
    "label": "map(x => 10 * x)",
    "inputs": [
      [{t:10, d:1}, {t:20, d:2}, {t:50, d:3}]
    ],
    "apply": function(inputs) {
      return inputs[0].map(x => x.set('content', x.get('content') * 10));
    }
  },

  "scan": {
    "label": "scan((x, y) => x + y)",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
    ],
    "apply": function(inputs) {
      return inputs[0].scan((x, y) => 
        y.set('content', x.get('content') + y.get('content'))
         .set('id', x.get('id') + y.get('id'))
      );
    }
  },

  "debounce": {
    "label": "debounce",
    "inputs": [
      [{t:0, d:1}, {t:26, d:2}, {t:34, d:3}, {t:40, d:4}, {t:45, d:5}, {t:79, d:6}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].debounce(10, scheduler);
    }
  },

  "debounceWithSelector": {
    "label": "debounceWithSelector(x => Rx.Observable.timer(10 * x))",
    "inputs": [
      [{t:0, d:1}, {t:26, d:2}, {t:34, d:1}, {t:40, d:1}, {t:45, d:2}, {t:79, d:1}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].debounceWithSelector(x =>
        Rx.Observable.timer(Number(x.get('content')) * 10, 1000, scheduler)
      );
    }
  }
};
