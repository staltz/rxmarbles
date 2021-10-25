import { zip, combineLatest, merge, concat, race } from 'rxjs';
import { map, startWith, withLatestFrom } from 'rxjs/operators'

/* t = time, c = content */
export const combinationExamples = {
  combineLatest: {
    label: 'combineLatest([obs1$, obs2$]).pipe(map(([x, y]) => "" + x + y)',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply(inputs) {
      return combineLatest(inputs).pipe(
        map(([x, y]) => ('' + x.content + y.content))
      );
    }
  },

  concat: {
    label: 'concat(obs1$, obs2$)',
    inputs: [
      [{t:0, c:1}, {t:15, c:1}, {t:50, c:1}, 57],
      [{t:0, c:2}, {t:8, c:2}, 12]
    ],
    apply(inputs) {
      return concat(...inputs);
    }
  },

  merge: {
    label: 'merge',
    inputs: [
      [{t:0, c:20}, {t:15, c:40}, {t:30, c:60}, {t:45, c:80}, {t:60, c:100}],
      [{t:37, c:1}, {t:68, c:1}]
    ],
    apply(inputs) {
      return merge(...inputs);
    },
  },

  race: {
    label: 'race',
    inputs: [
      [{t:10, c:20}, {t:20, c:40}, {t:30, c:60}],
      [{t:5, c:1}, {t:15, c:2}, {t:25, c:3}],
      [{t:20, c:0}, {t:32, c:0}, {t:44, c:0}]
    ],
    apply(inputs) {
      return race(inputs);
    }
  },

  startWith: {
    label: 'startWith(1)',
    inputs: [
      [{t:30, c:2}, {t:40, c:3}]
    ],
    apply(inputs) {
      return inputs[0].pipe(startWith(1));
    }
  },

  withLatestFrom: {
    label: 'withLatestFrom((x, y) => "" + x + y)',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply(inputs) {
      return inputs[0].pipe(
        withLatestFrom(inputs[1], (x, y) => ('' + x.content + y.content))
      );
    }
  },

  zip: {
    label: 'zip([obs1$, obs2$]).pipe(map(([x, y]) => "" + x + y)',
    inputs: [
      [{t:0, c:1}, {t:20, c:2}, {t:65, c:3}, {t:75, c:4}, {t:92, c:5}],
      [{t:10, c:'A'}, {t:25, c:'B'}, {t:50, c:'C'}, {t:57, c:'D'}]
    ],
    apply(inputs) {
      return zip(...inputs).pipe(
        map(([x, y]) => ('' + x.content + y.content))
      )
    }
  },
}
