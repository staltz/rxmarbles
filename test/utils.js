import Rx from 'rx'
import { ok, fail } from 'assert'

function createMessage(expected, actual) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

module.exports = {
  collectionAssert: {
    assertEqual: function (actual, expected) {
      var comparer = Rx.internals.isEqual, isOk = true;

      if (expected.length !== actual.length) {
        fail('Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        return;
      }

      for(var i = 0, len = expected.length; i < len; i++) {
        isOk = comparer(expected[i], actual[i]);
        if (!isOk) {
          break;
        }
      }

      ok(isOk, createMessage(expected, actual));
    }
  }
};
