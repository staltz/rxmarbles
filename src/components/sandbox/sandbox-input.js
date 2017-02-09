import { last } from 'ramda';

import { calculateNotificationHash } from './sandbox-utils';

function inputToMarbles(stream) {
  return stream.map(({ t: time, c: content }, index) => ({
    id: calculateNotificationHash({ time, content }),
    time,
    content,
    itemId: index,
    _itemId: index, // Collection.gather consumes your ID key
  }));
}

function getInput(input) {
  const lastInput = last(input);
  return typeof lastInput === 'number'
    ? input.slice(0, -1)
    : input;
}

function getTime(input) {
  const lastInput = last(input);
  return typeof lastInput === 'number'
    ? lastInput
    : 100;
}

export function inputsToTimelines(inputs) {
  return inputs
    .map((input, index) => ({
      id: index,
      _id: index,
      marbles: inputToMarbles(getInput(input)),
      end: { time: getTime(input) },
    }));
}
