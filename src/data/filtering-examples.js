import { Observable } from 'rxjs';

/* t = time, c = content */
export const filteringExamples = {
  debounceTime: {
    label: 'debounceTime(10)',
    inputs: [
      [{t:0, c:1}, {t:26, c:2}, {t:34, c:3}, {t:40, c:4}, {t:45, c:5}, {t:79, c:6}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].debounceTime(10, scheduler);
    }
  },

  debounce: {
    label: 'debounce(x => Rx.Observable.timer(10 * x))',
    inputs: [
      [{t:0, c:1}, {t:26, c:2}, {t:34, c:1}, {t:40, c:1}, {t:45, c:2}, {t:79, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].debounce(x =>
        Observable.timer(Number(x.content) * 10, 1000, scheduler)
      );
    }
  },

  distinct: {
    label: 'distinct',
    inputs: [
      [{t:5, c:1}, {t:20, c:2}, {t:35, c:2}, {t:60, c:1}, {t:70, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].distinct(x => x.content);
    }
  },

  distinctUntilChanged: {
    label: 'distinctUntilChanged',
    inputs: [
      [{t:5, c:1}, {t:20, c:2}, {t:35, c:2}, {t:60, c:1}, {t:70, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].distinctUntilChanged(undefined, x => x.content);
    }
  },

  elementAt: {
    label: 'elementAt(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].elementAt(2);
    }
  },

  filter: {
    label: 'filter(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs) {
      return inputs[0].filter(x => (x.content > 10));
    }
  },

  find: {
    label: 'find(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].find(x => (x.content > 10));
    }
  },

  findIndex: {
    label: 'findIndex(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].findIndex(({ content }) => (content > 10));
    }
  },

  first: {
    label: 'first',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].first();
    }
  },

  last: {
    label: 'last',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].last();
    }
  },

  skip: {
    label: 'skip(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}]
    ],
    apply: function(inputs) {
      return inputs[0].skip(2);
    }
  },

  skipUntil: {
    label: 'skipUntil',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:45, c:0}, {t:73, c:0}]
    ],
    apply: function(inputs) {
      return inputs[0].skipUntil(inputs[1]);
    }
  },

  take: {
    label: 'take(2)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].take(2, scheduler);
    }
  },

  takeLast: {
    label: 'takeLast(1)',
    inputs: [
      [{t:30, c:1}, {t:40, c:2}, {t:65, c:3}, {t:75, c:4}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].takeLast(1);
    }
  },

  takeUntil: {
    label: 'takeUntil',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:45, c:0}, {t:73, c:0}]
    ],
    apply: function(inputs) {
      return inputs[0].takeUntil(inputs[1]);
    }
  },
}