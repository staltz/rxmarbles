/*
 * Conversion from virtual time streams out to diagram data, and
 * vice-versa, and related functions.
 */

function calculateNotificationContentHash(content) {
  var SOME_PRIME_NUMBER = 877;
  if (typeof content === "string") {
    return content.split("")
      .map(function(x) { return x.charCodeAt(0); })
      .reduce(function(x, y) { return x + y; });
  } else if (typeof content === "number") {
    return content * SOME_PRIME_NUMBER;
  } else if (typeof content === 'boolean') {
    return content ? SOME_PRIME_NUMBER : SOME_PRIME_NUMBER*3;
  }
};

function calculateNotificationHash(marbleData) {
  var SMALL_PRIME = 7;
  var LARGE_PRIME = 1046527;
  var MAX = 100000;
  var contentHash = calculateNotificationContentHash(marbleData.content);
  return ((marbleData.time + contentHash + SMALL_PRIME) * LARGE_PRIME) % MAX;
};

module.exports = {
  calculateNotificationHash: calculateNotificationHash,
  calculateNotificationContentHash: calculateNotificationContentHash
};
