import { merge } from 'ramda';

export const mathExamples = {
  count: {
    label: 'count(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}, 80]
    ],
    apply: function(inputs) {
      return inputs[0].count(({ content }) => (content > 10));
    }
  },

  max: {
    label: 'max',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}, 80]
    ],
    apply: function(inputs) {
      return inputs[0].max((x, y) => {
        if (x.content > y.content) { return 1; }
        if (x.content < y.content) { return -1; }
        return 0;
      });
    }
  },

  min: {
    label: 'min',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}, 80]
    ],
    apply: function(inputs) {
      return inputs[0].min((x, y) => {
        if (x.content > y.content) { return 1; }
        if (x.content < y.content) { return -1; }
        return 0;
      });
    }
  },

  reduce: {
    label: 'reduce((x, y) => x + y)',
    inputs: [
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}, {t:35, c:4}, {t:65, c:5}, 80]
    ],
    apply: function(inputs) {
      return inputs[0].reduce((x, y) =>
        merge(x, { content: x.content + y.content, id: x.id + y.id })
      );
    }
  },
};
