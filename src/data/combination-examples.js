import { Observable } from 'rxjs';

/* t = time, c = content */
export const combinationExamples = {
  combineLatest: {
    label: 'combineLatest((x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply: function(inputs) {
      return Observable.combineLatest(inputs[0], inputs[1],
        (x, y) => ('' + x.content + y.content)
      );
    }
  },

  concat: {
    label: 'concat',
    inputs: [
      [{t:0, c:1}, {t:15, c:1}, {t:50, c:1}, 57],
      [{t:0, c:2}, {t:8, c:2}, 12]
    ],
    apply: function(inputs) {
      return Observable.concat(...inputs);
    }
  },

  merge: {
    label: 'merge',
    inputs: [
      [{t:0, c:20}, {t:15, c:40}, {t:30, c:60}, {t:45, c:80}, {t:60, c:100}],
      [{t:37, c:1}, {t:68, c:1}]
    ],
    apply: function(inputs) {
      return Observable.merge(...inputs);
    },
  },

  race: {
    label: 'race',
    inputs: [
      [{t:10, c:20}, {t:20, c:40}, {t:30, c:60}],
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}],
      [{t:20, c:0}, {t:32, c:0}, {t:44, c:0}]
    ],
    apply: function(inputs) {
      return Observable.race(inputs);
    }
  },

  startWith: {
    label: 'startWith(1)',
    inputs: [
      [{t:30, c:2}, {t:40, c:3}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].startWith(1, scheduler);
    }
  },

  withLatestFrom: {
    label: 'withLatestFrom((x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply: function(inputs) {
      return inputs[0].withLatestFrom(inputs[1],
        (x, y) => ('' + x.content + y.content)
      );
    }
  },

  zip: {
    label: 'zip',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply: function(inputs) {
      return Observable.zip(inputs[0], inputs[1],
        (x, y) => ('' + x.content + y.content)
      );
    }
  },
}