import Rx, { ReactiveTest, TestScheduler } from 'rx'
import { collectionAssert } from './utils'
import hook from '../src/rx-debug'
hook()

var onNext = ReactiveTest.onNext, 
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe

function Marble(data$) {
  return data$
    .distinctUntilChanged()
    .map(data => [data$.key, `Marble[${data.content}] @ ${data.time}`])
    .concat(Rx.Observable.just([data$.key, false]))
}

describe('marble groups', function () {
  var scheduler = new TestScheduler();

  var marbles = [{
      content: 1,
      diagramId: 0,
      example: "debounce",
      id: 1,
      time: 10,
    },{
      content: 2,
      diagramId: 0,
      example: "debounce",
      id: 2,
      time: 20,
    },{
      content: 3,
      diagramId: 0,
      example: "debounce",
      id: 3,
      time: 30,
    }];
    
  it('should close', function(){
    var input = scheduler.createHotObservable(
      onNext(100, marbles),
      onNext(200, marbles.slice(1)),
    );

    var results = scheduler.startWithTiming(
      function () {
        return input
          .flatMap(n => n)
          .groupByUntil(
            d => d.id,
            v => v,
            d => input
              .map(list => !list.some(ad => ad.id === d.key))
              .filter(b => b)
          )
          .flatMap(Marble)
          .scan({}, (memo, next) => {
            var copy = Object.keys(memo)
              .reduce((o, k) => { o[k] = memo[k]; return o }, {});
            if(next[1] === false) {
              delete copy[next[0]];
            } else {
              copy[next[0]] = next[1];
            }
            return copy;
          })
          .map(obj => Object.keys(obj).map(k => obj[k]))
          .map(l => l.join(", "))
          .debounce(10, scheduler)
      }, 0, 0, 400
    );

    collectionAssert.assertEqual(results.messages, [
       onNext(110, [
        `Marble[1] @ 10`,
        `Marble[2] @ 20`,
        `Marble[3] @ 30`,
      ].join(", ")),
      onNext(210, [
        `Marble[2] @ 20`,
        `Marble[3] @ 30`,
      ].join(", "))
    ]);
  })
});
