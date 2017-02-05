import { prop } from 'ramda';

/* t = time, c = content */
export const utilityExamples = {
  delay: {
    label: 'delay(20)',
    inputs: [
      [{t:10, c:'1'}, {t:20, c:'2'}, {t:70, c:'1'}]
    ],
    apply: (inputs, scheduler) =>
      inputs[0].map(prop('content')).delay(20, scheduler),
  },
};
