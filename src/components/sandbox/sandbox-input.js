import { calculateNotificationHash } from './sandbox-utils';

function inputsToMarbles(inputs) {
  return inputs.map(stream =>
    stream.map(({ t: time, c: content }, index) => ({
      id: calculateNotificationHash({ time, content }),
      time,
      content,
      itemId: index,
      _itemId: index, // Collection.gather consumes your ID key
    }))
  );
}

export function inputsToTimelines(inputs) {
  return inputsToMarbles(inputs)
    .map((marbles, index) => ({
      id: index,
      _id: index,
      marbles,
      end: { time: 100 },
    }));
}
