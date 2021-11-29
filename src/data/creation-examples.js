import { Observable } from 'rxjs';

export const creationExamples = {
  // Incomplete
  from: {
    label: 'Observable.from([10, 20, 30]).delayWhen(x => timer(x))',
    inputs: [],
    apply: function(inputs, scheduler) {
      return Observable.from([10, 20, 30]).delayWhen(x => Observable.timer(x, scheduler));
    }
  },

  interval: {
    label: 'Observable.interval(10)',
    inputs: [],
    apply: function(inputs, scheduler) {
      return Observable.interval(10, scheduler);
    }
  },

  of: {
    label: 'Observable.of(1)',
    inputs: [],
    apply: function() {
      return Observable.of(1);
    }
  },

  range: {
    label: 'Observable.range(3, 7).delayWhen(x => timer(x * 10))',
    inputs: [],
    apply: function(inputs, scheduler) {
      return Observable.range(3, 7).delayWhen(x => Observable.timer(x * 10, scheduler));
    }
  },

  timer: {
    label: 'Observable.timer(30, 10)',
    inputs: [],
    apply: function(inputs, scheduler) {
      return Observable.timer(30, 10, scheduler);
    }
  },
};
