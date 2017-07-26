import { Observable } from 'rxjs';

/* t = time, c = content */
export const conditionalExamples = {
  defaultIfEmpty: {
    label: 'defaultIfEmpty(true)',
    inputs: [[99]],
    apply: function(inputs) {
      return inputs[0].defaultIfEmpty(true);
    }
  },

  every: {
    label: 'every(x => x < 10)',
    inputs: [
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}, {t:35, c:4}, {t:65, c:5}, 80]
    ],
    apply: function(inputs) {
      return inputs[0].every(({ content }) => (content < 10));
    }
  },

  sequenceEqual: {
    label: "sequenceEqual",
    inputs: [
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}, {t:35, c:4}, {t:65, c:5}, 85],
      [{t:2, c:1}, {t:20, c:2}, {t:40, c:3}, {t:70, c:4}, {t:77, c:5}, 85]
    ],
    apply: function(inputs) {
      return inputs[0].sequenceEqual(inputs[1],
        (x, y) => (x.content === y.content)
      );
    }
  },
}