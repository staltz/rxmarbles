import { from, timer, interval, of } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

export const creationExamples = {
  // Incomplete
  from: {
    label: 'from([10, 20, 30]).pipe(delayWhen(x => timer(x)))',
    inputs: [],
    apply(inputs, scheduler) {
      return from([10, 20, 30]).pipe(delayWhen(x => timer(x, scheduler)));
    }
  },

  interval: {
    label: 'interval(10)',
    inputs: [],
    apply(inputs, scheduler) {
      return interval(10, scheduler);
    }
  },

  of: {
    label: 'of(1)',
    inputs: [],
    apply() {
      return of(1);
    }
  },

  timer: {
    label: 'timer(30, 10)',
    inputs: [],
    apply(inputs, scheduler) {
      return timer(30, 10, scheduler);
    }
  },
};
