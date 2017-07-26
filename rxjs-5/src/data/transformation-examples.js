import { Observable } from 'rxjs';
import { evolve, merge, prop } from 'ramda';

/* t = time, c = content */
export const transformationExamples = {
  buffer: {
    label: 'buffer',
    inputs: [
      [{t:9, c:'A'}, {t:23, c:'B'}, {t:40, c:'C'}, {t:54, c:'D'}, {t:71, c:'E'}, {t:85, c:'F'}],
      [{t:33, c:0}, {t:66, c:0}, {t:90, c:0}],
    ],
    apply: function(inputs) {
      return inputs[0].pluck('content')
        .buffer(inputs[1])
        .map(x => `[${x}]`);
    }
  },

  bufferCount: {
    label: 'bufferCount(3, 2)',
    inputs: [
      [{t:9, c:'A'}, {t:23, c:'B'}, {t:40, c:'C'}, {t:54, c:'D'}, {t:71, c:'E'}, {t:85, c:'F'}],
    ],
    apply: function(inputs) {
      return inputs[0].pluck('content')
        .bufferCount(3, 2)
        .map(x => `[${x}]`);
    } 
  },

  bufferTime: {
    label: 'bufferTime(30)',
    inputs: [
      [{t:0, c:'A'}, {t:10, c:'B'}, {t:22, c:'C'}, {t:61, c:'D'}, {t:71, c:'E'}, {t:95, c:'F'}],
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .bufferTime(30, scheduler)
        .map(x => `[${x}]`);
    } 
  },

  bufferToggle: {
    label: 'bufferToggle(start$, x => Observable.timer(x))',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:15, c:10}, {t:45, c:30}],
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .bufferToggle(inputs[1], (x) => Observable.timer(x.content, scheduler))
        .map(x => `[${x}]`);
    }
  },

  bufferWhen: {
    label: 'bufferWhen',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, {t:30, c:4}, {t:40, c:5}, {t:50, c:6}, {t:60, c:7}, {t:70, c:8}, {t:80, c:9}],
      [{t:35, c:0}, {t:50, c:0}],
    ],
    apply: function(inputs) {
      return inputs[0].pluck('content')
        .bufferWhen(() => inputs[1])
        .map(x => `[${x}]`);
    }
  },

  concatMap: {
    label: 'obs1$.concatMap(() => obs2$, (x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:'A'}, {t:42, c:'B'}, {t:55, c:'C'}],
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .concatMap(() => inputs[1].pluck('content'), (x, y) => '' + x + y);
    }
  },

  concatMapTo: {
    label: 'obs1$.concatMapTo(obs2$, (x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:'A'}, {t:42, c:'B'}, {t:55, c:'C'}],
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .concatMapTo(inputs[1].pluck('content'), (x, y) => '' + x + y);
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

  mapTo: {
    label: 'mapTo("a")',
    inputs: [
      [{t:10, c:1}, {t:20, c:2}, {t:50, c:3}]
    ],
    apply: function(inputs) {
      return inputs[0].mapTo('a');
    }
  },

  mergeMap: {
    label: 'obs1$.mergeMap(() => obs2$, (x, y) => "" + x + y, 2)',
    inputs: [
      [{t:0, c:'A'}, {t:3, c:'B'}, {t:6, c:'C'}],
      [{t:0, c:1}, {t:12, c:2}, {t:24, c:3}, 28]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .mergeMap(() => inputs[1].pluck('content'), (x, y) => '' + x + y, 2);
    }
  },

  mergeMapTo: {
    label: 'obs1$.mergeMapTo(obs2$, (x, y) => "" + x + y, 2)',
    inputs: [
      [{t:0, c:'A'}, {t:3, c:'B'}, {t:6, c:'C'}],
      [{t:0, c:1}, {t:12, c:2}, {t:24, c:3}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .mergeMapTo(inputs[1].pluck('content'), (x, y) => '' + x + y, 2);
    }
  },

  pairwise: {
    label: 'pairwise',
    inputs: [
      [{t:9, c:'A'}, {t:23, c:'B'}, {t:40, c:'C'}, {t:54, c:'D'}, {t:71, c:'E'}, {t:85, c:'F'}],
    ],
    apply: function(inputs) {
      return inputs[0].pluck('content')
        .pairwise().map(x => `[${x}]`);
    }
  },

  pluck: {
    label: 'pluck("a")',
    inputs: [
      [{t:10, c:'{a:1}'}, {t:20, c:'{a:2}'}, {t:50, c:'{a:5}'}]
    ],
    apply: function(inputs) {
      // simulated implementation
      return inputs[0].map(evolve({ content: c => c.match(/\d/)[0] }));
    }
  },

  repeat: {
    label: 'repeat(3)',
    inputs: [
      [{t:0, c:'A'}, {t:12, c: 'B'}, 26],
    ],
    apply: function(inputs) {
      return inputs[0].repeat(3);
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

  switchMap: {
    label: 'obs1$.switchMap(() => obs2$, (x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:'A'}, {t:42, c:'B'}, {t:55, c:'C'}],
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .switchMap(() => inputs[1].pluck('content'), (x, y) => '' + x + y);
    }
  },

  switchMapTo: {
    label: 'obs1$.switchMap(obs2$, (x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:'A'}, {t:42, c:'B'}, {t:55, c:'C'}],
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:3}, 25]
    ],
    apply: function(inputs, scheduler) {
      return inputs[0].pluck('content')
        .switchMapTo(inputs[1].pluck('content'), (x, y) => '' + x + y);
    }
  },
};
