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
};
