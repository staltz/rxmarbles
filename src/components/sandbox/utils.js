/*
 * Conversion from virtual time streams out to diagram data, and
 * vice-versa, and related functions.
 */

function calculateNotificationContentHash(content) {
  const SMALL_PRIME_1 = 59;
  const SMALL_PRIME_2 = 97;
  const SOME_PRIME_NUMBER = 877;
  if (typeof content === "string") {
    return content.split("")
      .map(x => x.charCodeAt(0))
      .reduce((x, y) => (x * SMALL_PRIME_1) + (y * SMALL_PRIME_2));
  } else if (typeof content === "number") {
    return parseInt(content) * SOME_PRIME_NUMBER;
  } else if (typeof content === 'boolean') {
    return content ? SOME_PRIME_NUMBER : SOME_PRIME_NUMBER*3;
  }
}

function calculateNotificationHash(marbleData) {
  const SMALL_PRIME = 7;
  const LARGE_PRIME = 1046527;
  const MAX = 100000;
  const contentHash = calculateNotificationContentHash(marbleData.content);
  return ((marbleData.time + contentHash + SMALL_PRIME) * LARGE_PRIME) % MAX;
}

module.exports = {
  calculateNotificationHash: calculateNotificationHash,
  calculateNotificationContentHash: calculateNotificationContentHash
};
