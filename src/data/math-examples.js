import { merge } from 'ramda';
import { count, max, min, reduce } from 'rxjs/operators';

export const mathExamples = {
  count: {
    label: 'count(x => x > 10)',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, 80]
    ],
    apply(inputs) {
      return inputs[0].pipe(count(({ content }) => (Number(content) > 10)));
    }
  },

  max: {
    label: 'max',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}, 80]
    ],
    apply(inputs) {
      return inputs[0].pipe(
        max((x, y) => {
          if (x.content > y.content) { return 1; }
          if (x.content < y.content) { return -1; }
          return 0;
        })
      );
    }
  },

  min: {
    label: 'min',
    inputs: [
      [{t:5, c:2}, {t:15, c:30}, {t:25, c:22}, {t:35, c:5}, {t:45, c:60}, {t:55, c:1}, 80]
    ],
    apply(inputs) {
      return inputs[0].pipe(
        min((x, y) => {
          if (x.content > y.content) { return 1; }
          if (x.content < y.content) { return -1; }
          return 0;
        })
      );
    }
  },

  reduce: {
    label: 'reduce((x, y) => x + y)',
    inputs: [
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}, {t:35, c:4}, {t:65, c:5}, 80]
    ],
    apply(inputs) {
      return inputs[0].pipe(
        reduce((x, y) =>
          merge(x, { content: x.content + y.content, id: x.id + y.id })
        )
      );
    }
  },
};
