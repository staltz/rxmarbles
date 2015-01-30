var Rx = require('cyclejs').Rx;

module.exports = {
  // A clone of scan?
  // "aggregate": {
  //   "label": "aggregate((x, y) => x + y)"
  //   "inputs": [
  //     [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}]
  //   ]
  //   "apply": (inputs) -> inputs[0].aggregate((x, y) ->
  //     return {content: x.content + y.content, time: x.time, id: x.id+y.id}
  //   )
  // }

  "average": {
    "label": "average",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:30, d:2}, {t:50, d:2}, {t:65, d:5}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].average(x => x.get('content'));
    }
  },

  "count": {
    "label": "count(x => x > 10)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].count(x => (x.get('content') > 10));
    }
  },

  "max": {
    "label": "max",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].max((x, y) => {
        if (x.get('content') > y.get('content')) { return 1; }
        if (x.get('content') < y.get('content')) { return -1; }
        return 0;
      });
    }
  },

  "min": {
    "label": "min",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].min((x, y) => {
        if (x.get('content') > y.get('content')) { return 1; }
        if (x.get('content') < y.get('content')) { return -1; }
        return 0;
      });
    }
  },

  "reduce": {
    "label": "reduce((x, y) => x + y)",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].reduce((x, y) =>
        y.set('content', x.get('content') + y.get('content'))
         .set('id', x.get('id') + y.get('id'))
      );
    }
  },

  "sum": {
    "label": "sum",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].sum(x => x.get('content'));
    }
  }
};
