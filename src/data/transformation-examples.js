import { Observable } from 'rxjs';
import { evolve, merge } from 'ramda';

/* t = time, c = content */
export const transformationExamples = {
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

  delayWhen: {
    label: 'delayWhen(x => Rx.Observable.timer(20 * x))',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:1}]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].delayWhen(({ content }) =>
        Observable.timer(Number(content) * 20, 1000, scheduler)
      );
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

  map: {
    label: 'map(x => 10 * x)',
    inputs: [
      [{t:10, c:1}, {t:20, c:2}, {t:50, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].map(evolve({ content: (c) => c * 10 }));
    }
  },

  scan: {
    label: 'scan((x, y) => x + y)',
    inputs: [
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}, {t:35, c:4}, {t:65, c:5}]
    ],
    apply: function(inputs) {
      return inputs[0].scan((x, y) =>
        merge(x, { content: x.content + y.content, id: x.id + y.id })
      );
    }
  },

  debounceTime: {
    label: 'debounce',
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
  }
};
