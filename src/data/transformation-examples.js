import { Observable } from 'rxjs';

/* t = time, c = content */
export const transformationExamples = {
  merge: {
    label: 'merge',
    inputs: [
      [{t:0, c:20}, {t:15, c:40}, {t:30, c:60}, {t:45, c:80}, {t:60, c:100}],
      [{t:37, c:1}, {t:68, c:1}]
    ],
    apply: function(inputs) {
      return Observable.merge(...inputs).map(input => input.content);
    },
  },
};
