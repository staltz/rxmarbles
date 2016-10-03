import Rx, { ReactiveTest, TestScheduler } from 'rx'
import { collectionAssert } from './utils'
import addDebug from '../src/rx-debug'
import addOperator from '../src/rx-collection'
addDebug()
addOperator()

var onNext = ReactiveTest.onNext, 
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe

const never = Rx.Observable.never()

describe('component collections', function () {
  var scheduler = instrumentScheduler(new TestScheduler());

  var components = [{
    DOM: Rx.Observable.of("A1", "A2").merge(never),
    clicks$: never
  },{
    DOM: Rx.Observable.of("B1", "B2", "B3").merge(never),
    clicks$: Rx.Observable.of(1).delay(2, scheduler).merge(never)
  },{
    DOM: Rx.Observable.of("C1").merge(never),
    clicks$: Rx.Observable.of(4).delay(5, scheduler).merge(never)
  }];

  const output = () => Rx.Observable
      .fromArray(components)
      .merge(never)
      .collection({
        latest: {
          DOM: (item) => item.DOM.shareReplay(1),
        },
        merge: {
          clicks$: (item) => item.clicks$.map(item)
        }
      });
    
  it('should combine latest', function(){
    var results = scheduler.startScheduler(
      function () {
        return output().DOM.debounce(10, scheduler)
      }, { created: 0, subscribed: 0, disposed: 400 }
    );
    collectionAssert.assertEqual(results.messages, [
       onNext(11, ["A2", "B3", "C1"])
    ])
  })

  it('should merge streams', function(){
    var results = scheduler.startScheduler(
      function () {
        return output().clicks$
      }, { created: 500, subscribed: 500, disposed: 800 }
    );

    collectionAssert.assertEqual(results.messages, [
      onNext(502, components[1]),
      onNext(505, components[2])
    ])
  })

  it('should close', function(){
    var scheduler = instrumentScheduler(new TestScheduler());

    const nots = Rx.Observable
      .merge(
        Rx.Observable.of([1,2,3]),
        Rx.Observable.of([1,2]).delay(100, scheduler)
      )
      .merge(never)

    const comps = nots.publish(nots => nots
      .flatMap(n => n)
      .groupByUntil(
        d => d, 
        v => v,
        d => nots
          .map(list => !list.some(ad => ad === d.key))
          .filter(b => b)
        )
      )
      .map(group => ({ DOM: group }))

    var output = comps
      .collection({
        latest: {
          DOM: (item) => item.DOM.distinctUntilChanged(),
        }
      });

    var results = scheduler.startScheduler(() => output.DOM, { created: 0, subscribed: 0, disposed: 1000 });

    collectionAssert.assertEqual(results.messages, [
      onNext(1, [1]),
      onNext(1, [1, 2]),
      onNext(1, [1, 2, 3]),
      onNext(101, [1, 2])
    ])
  })
});

function instrumentScheduler(scheduler) {
  var original = scheduler.getNext;
  scheduler.getNext = function(){
    var o = original.call(this);
    if(o == null) return o;
    var inv = o.invoke;
    o.invoke = function(){
      //console.log("t: ", scheduler.now());
      return inv.apply(this, arguments);
    }
    return o;
  }
  return scheduler;
}
