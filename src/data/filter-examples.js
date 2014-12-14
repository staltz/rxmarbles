var Rx = require('rx');

module.exports = {
  "distinct": {
    "label": "distinct",
    "inputs": [
      [{t:5, d:1}, {t:20, d:2}, {t:35, d:2}, {t:60, d:1}, {t:70, d:3}]
    ],
    "apply": function(inputs) {
      return inputs[0].distinct(function(x) { return x.content; });
    }
  },

  "distinctUntilChanged": {
    "label": "distinctUntilChanged",
    "inputs": [
      [{t:5, d:1}, {t:20, d:2}, {t:35, d:2}, {t:60, d:1}, {t:70, d:3}]
    ],
    "apply": function(inputs) {
      return inputs[0].distinctUntilChanged(function(x) { return x.content; });
    }
  },

  "elementAt": {
    "label": "elementAt(2)",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].elementAt(2);
    }
  },

  "filter": {
    "label": "filter(x => x > 10)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ],
    "apply": function(inputs) {
      return inputs[0].filter(function(x) { return x.content > 10; });
    }
  },

  "find": {
    "label": "find(x => x > 10)",
    "inputs": [
      [{t:5, d:2}, {t:15, d:30}, {t:25, d:22}, {t:35, d:5}, {t:45, d:60}, {t:55, d:1}]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].find(function(x) { return x.content > 10; });
    }
  },

  "first": {
    "label": "first",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}, 85]
    ],
    "apply": function(inputs) {
      return inputs[0].first();
    }
  },

  "last": {
    "label": "last",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}, 85]
    ],
    "apply": function(inputs) {
      return inputs[0].last();
    }
  },

  "pausable": {
    "label": "pausable",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}],
      [{t:15, d:true}, {t:35, d:false}, {t:55, d:true}]
    ],
    "apply": function(inputs) {
      inputs[0].subscribe(function(x) { return 0; });
      var subject = new Rx.Subject();
      inputs[1].subscribe(function(x) { subject.onNext(x.content); });
      return inputs[0].pausable(subject);
    }
  },

  "pausableBuffered": {
    "label": "pausableBuffered",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}],
      [{t:15, d:true}, {t:35, d:false}, {t:55, d:true}]
    ],
    "apply": function(inputs) {
      inputs[0].subscribe(function(x) { return 0; });
      var subject = new Rx.Subject();
      inputs[1].subscribe(function(x) { subject.onNext(x.content); });
      return inputs[0].pausableBuffered(subject);
    }
  },

  "skip": {
    "label": "skip(2)",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ],
    "apply": function(inputs) {
      return inputs[0].skip(2);
    }
  },

  "skipLast": {
    "label": "skipLast(2)",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}]
    ],
    "apply": function(inputs) {
      return inputs[0].skipLast(2);
    }
  },

  "skipUntil": {
    "label": "skipUntil",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}],
      [{t:45, d:0}, {t:73, d:0}]
    ],
    "apply": function(inputs) {
      return inputs[0].skipUntil(inputs[1]);
    }
  },

  "take": {
    "label": "take(2)",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}, 85]
    ],
    "apply": function(inputs, scheduler) {
      return inputs[0].take(2, scheduler);
    }
  },

  "takeLast": {
    "label": "takeLast(1)",
    "inputs": [
      [{t:30, d:1}, {t:40, d:2}, {t:65, d:3}, {t:75, d:4}, 85]
    ],
    "apply": function(inputs) {
      return inputs[0].takeLast(1);
    }
  },

  "takeUntil": {
    "label": "takeUntil",
    "inputs": [
      [{t:0, d:1}, {t:10, d:2}, {t:20, d:3}, {t:30, d:4}, {t:40, d:5}, {t:50, d:6}, {t:60, d:7}, {t:70, d:8}, {t:80, d:9}],
      [{t:45, d:0}, {t:73, d:0}]
    ],
    "apply": function(inputs) {
      return inputs[0].takeUntil(inputs[1]);
    }
  }
};
