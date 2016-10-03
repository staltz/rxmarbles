import Rx, { ReactiveTest, TestScheduler } from 'rx'
import { collectionAssert } from './utils'
import addDebug from '../src/rx-debug'
import addOperator from '../src/rx-collection'
addDebug()
addOperator()

var onNext = ReactiveTest.onNext, 
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe

describe('component collections', function () {
  var scheduler = new TestScheduler();

  var components = [{
    DOM: Rx.Observable.of("A1", "A2"),
    clicks$: Rx.Observable.empty()
  },{
    DOM: Rx.Observable.of("B1", "B2", "B3"),
    clicks$: Rx.Observable.just(1).delay(2, scheduler)
  },{
    DOM: Rx.Observable.of("C1"),
    clicks$: Rx.Observable.just(4).delay(5, scheduler)
  }];

  const output = () => Rx.Observable
      .fromArray(components)
      .collection({
        latest: {
          DOM: (item) => item.DOM,
        },
        merge: {
          clicks$: (item) => item.clicks$.map(item)
        }
      });
    
  it('should combine latest', function(){
    var results = scheduler.startWithTiming(
      function () {
        return output().DOM.debounce(10)
      }, 0, 0, 400
    );
    collectionAssert.assertEqual(results.messages, [
       onNext(1, ["A2", "B3", "C1"]),
       onCompleted(1)
    ])
  })

  it('should merge streams', function(){
    var results = scheduler.startWithTiming(
      function () {
        return output().clicks$
      }, 500, 500, 800
    );

    collectionAssert.assertEqual(results.messages, [
      onNext(502, components[1]),
      onNext(505, components[2]),
      onCompleted(505)
    ])
  })
});
