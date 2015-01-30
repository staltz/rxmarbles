var Rx = require('cyclejs').Rx;

module.exports = {
  "every": {
    "label": "every(x => x < 10)",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}, 80]
    ],
    "apply": function(inputs) {
      return inputs[0].every(x => (x.get('content') < 10));
    }
  },

  "some": {
    "label": "some(x => x > 10)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ],
    "apply": function(inputs) {
      return inputs[0].some(x => (x.get('content') > 10));
    }
  },

  "contains": {
    "label": "contains(22)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ],
    "apply": function(inputs) {
      return inputs[0]
        .map(x => (x.get('content')))
        .contains(22);
    }
  },

  "sequenceEqual": {
    "label": "sequenceEqual",
    "inputs": [
      [{t:5, d:1}, {t:15, d:2}, {t:25, d:3}, {t:35, d:4}, {t:65, d:5}, 85],
      [{t:2, d:1}, {t:20, d:2}, {t:40, d:3}, {t:70, d:4}, {t:77, d:5}, 85]
    ],
    "apply": function(inputs) {
      return inputs[0].sequenceEqual(inputs[1],
        (x, y) => (x.get('content') === y.get('content'))
      );
    }
  }
};
