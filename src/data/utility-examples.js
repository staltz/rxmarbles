import { timer } from 'rxjs';
import { pluck, delay, delayWhen } from 'rxjs/operators';

/* t = time, c = content */
export const utilityExamples = {
  delay: {
    label: 'delay(20)',
    inputs: [
      [{t:10, c:'1'}, {t:20, c:'2'}, {t:70, c:'1'}]
    ],
    apply(inputs, scheduler) {
      return inputs[0].pipe( pluck('content'), delay(20, scheduler) )
    }
  },

  delayWhen: {
    label: 'delayWhen(x => timer(20 * x))',
    inputs: [
      [{t:0, c:1}, {t:10, c:2}, {t:20, c:1}, {t:30, c:3}]
    ],
    apply(inputs, scheduler) {
      return inputs[0].pipe(
        pluck('content'),
        delayWhen(content => timer(Number(content) * 20, 1000, scheduler))
      );
    }
  },
};
