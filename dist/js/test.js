(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  observableProto.collection = function (config) {
    var root = this.share(),
        merge = [],
        latest = [];

    if (config.merge) {
      merge = Object.keys(config.merge).map(function (field) {
        var mapping = config.merge[field];
        if (typeof mapping == 'function') {
          return [field, root.flatMap(function (item) {
            return mapping(item);
          })];
        } else if (typeof mapping == 'string') {
          return [field, root.flatMap(function (item) {
            return item[mapping];
          })];
        } else {
          console.warn("unknown collection operation for merge-field", field);
        }
      });
    }

    if (config.latest) {
      latest = Object.keys(config.latest).map(function (field) {
        var mapping = config.latest[field];
        var combined = root.map(function (item, index) {
          if (typeof mapping == 'function') {
            return [index, mapping(item)];
          } else if (typeof mapping == 'string') {
            return [index, item[mapping]];
          } else {
            console.warn("unknown collection operation for latest-field", field);
          }
        }).flatMap(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var index = _ref2[0];
          var obs = _ref2[1];
          return obs.publish(function (o) {
            return o.filter(function (_) {
              return false;
            }).concat(Observable.of([index, undefined])).startWith([index, o]);
          });
        }).scan(function (memory, _ref3) {
          var _ref4 = _slicedToArray(_ref3, 2);

          var index = _ref4[0];
          var observable = _ref4[1];

          // TODO remove undesired shareReplay: 
          // the publish above causes the original source not to replay,
          // since the subscription is kept open.
          memory[index] = observable && observable.shareReplay(1);
          return memory;
        }, []).map(function (list) {
          return list.filter(function (v) {
            return typeof v !== 'undefined';
          });
        }).flatMapLatest(function (list, c) {
          return Observable.combineLatest(list, function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return args;
          });
        });
        return [field, combined];
      });
    }

    return merge.concat(latest).reduce(function (obj, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2);

      var field = _ref6[0];
      var obs = _ref6[1];

      obj[field] = obs;
      return obj;
    }, {});
  };
};

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Observable = _rx2.default.Observable,
    observableProto = Observable.prototype;

;

},{"rx":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  observableProto.combineOpenGroups = function (selector, groupTransform) {
    if (typeof selector == 'undefined' || selector == null) {
      selector = function selector(v) {
        return v;
      };
    }
    if (typeof groupTransform == 'undefined' || groupTransform == null) {
      groupTransform = function groupTransform(v) {
        return v;
      };
    }

    return this.flatMap(function (group) {
      return groupTransform(group).map(function (item) {
        return [group.key, selector(item)];
      }).concat(_rx2.default.Observable.just([group.key, false]));
    }).scan(function (memo, next) {
      var copy = Object.keys(memo).reduce(function (o, k) {
        o[k] = memo[k];return o;
      }, {});
      if (next[1] === false) {
        delete copy[next[0]];
      } else {
        copy[next[0]] = next[1];
      }
      return copy;
    }, {}).map(function (obj) {
      return Object.keys(obj).map(function (k) {
        return obj[k];
      });
    });
  };
};

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Observable = _rx2.default.Observable,
    observableProto = Observable.prototype;

;

},{"rx":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  observableProto.debug = function (key) {
    return new DebugObservable(this, key);
  };
};

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Observable = _rx2.default.Observable,
    inherits = _rx2.default.internals.inherits,
    ObservableBase = _rx2.default.ObservableBase,
    Disposable = _rx2.default.Disposable,
    AbstractObserver = _rx2.default.internals.AbstractObserver,
    observableProto = Observable.prototype;

var DebugObservable = function (__super__) {
  inherits(DebugObservable, __super__);
  function DebugObservable(source, key) {
    this.source = source;
    this._key = key;
    __super__.call(this);
  }

  DebugObservable.prototype.subscribeCore = function (o) {
    var _this = this;

    var parent = this.source.subscribe(new DebugObserver(o, this._key));
    return Disposable.create(function () {
      console.log('rx.debug', 'dispose', _this._key);
      parent.dispose();
    });
  };

  return DebugObservable;
}(ObservableBase);

var DebugObserver = function (__super__) {
  inherits(DebugObserver, __super__);
  function DebugObserver(o, key) {
    console.log('rx.debug', 'subscription', key);
    this._o = o;
    this._key = key;
    __super__.call(this);
  }

  DebugObserver.prototype.next = function (x) {
    console.log('rx.debug', this._key, 'next', x);
    this._o.onNext(x);
  };

  DebugObserver.prototype.error = function (e) {
    console.log('rx.debug', this._key, 'error', e);
    this._o.onError(e);
  };

  DebugObserver.prototype.completed = function () {
    console.log('rx.debug', this._key, 'completed');
    this._o.onCompleted();
  };

  return DebugObserver;
}(AbstractObserver);

;

},{"rx":undefined}],4:[function(require,module,exports){
'use strict';

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _utils = require('./utils');

var _rxDebug = require('../src/rx-debug');

var _rxDebug2 = _interopRequireDefault(_rxDebug);

var _rxCollection = require('../src/rx-collection');

var _rxCollection2 = _interopRequireDefault(_rxCollection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _rxDebug2.default)();
(0, _rxCollection2.default)();

var onNext = _rx.ReactiveTest.onNext,
    onCompleted = _rx.ReactiveTest.onCompleted,
    subscribe = _rx.ReactiveTest.subscribe;

var never = _rx2.default.Observable.never();

describe('component collections', function () {
  var scheduler = instrumentScheduler(new _rx.TestScheduler());

  var components = [{
    DOM: _rx2.default.Observable.of("A1", "A2").merge(never),
    clicks$: never
  }, {
    DOM: _rx2.default.Observable.of("B1", "B2", "B3").merge(never),
    clicks$: _rx2.default.Observable.of(1).delay(2, scheduler).merge(never)
  }, {
    DOM: _rx2.default.Observable.of("C1").merge(never),
    clicks$: _rx2.default.Observable.of(4).delay(5, scheduler).merge(never)
  }];

  var output = function output() {
    return _rx2.default.Observable.fromArray(components).merge(never).collection({
      latest: {
        DOM: function DOM(item) {
          return item.DOM.shareReplay(1);
        }
      },
      merge: {
        clicks$: function clicks$(item) {
          return item.clicks$.map(item);
        }
      }
    });
  };

  it('should combine latest', function () {
    var results = scheduler.startScheduler(function () {
      return output().DOM.debounce(10, scheduler);
    }, { created: 0, subscribed: 0, disposed: 400 });
    _utils.collectionAssert.assertEqual(results.messages, [onNext(11, ["A2", "B3", "C1"])]);
  });

  it('should merge streams', function () {
    var results = scheduler.startScheduler(function () {
      return output().clicks$;
    }, { created: 500, subscribed: 500, disposed: 800 });

    _utils.collectionAssert.assertEqual(results.messages, [onNext(502, components[1]), onNext(505, components[2])]);
  });

  it('should close', function () {
    var scheduler = instrumentScheduler(new _rx.TestScheduler());

    var nots = _rx2.default.Observable.merge(_rx2.default.Observable.of([1, 2, 3]), _rx2.default.Observable.of([1, 2]).delay(100, scheduler)).merge(never);

    var comps = nots.publish(function (nots) {
      return nots.flatMap(function (n) {
        return n;
      }).groupByUntil(function (d) {
        return d;
      }, function (v) {
        return v;
      }, function (d) {
        return nots.map(function (list) {
          return !list.some(function (ad) {
            return ad === d.key;
          });
        }).filter(function (b) {
          return b;
        });
      });
    }).map(function (group) {
      return { DOM: group };
    });

    var output = comps.collection({
      latest: {
        DOM: function DOM(item) {
          return item.DOM.distinctUntilChanged();
        }
      }
    });

    var results = scheduler.startScheduler(function () {
      return output.DOM;
    }, { created: 0, subscribed: 0, disposed: 1000 });

    _utils.collectionAssert.assertEqual(results.messages, [onNext(1, [1]), onNext(1, [1, 2]), onNext(1, [1, 2, 3]), onNext(101, [1, 2])]);
  });
});

function instrumentScheduler(scheduler) {
  var original = scheduler.getNext;
  scheduler.getNext = function () {
    var o = original.call(this);
    if (o == null) return o;
    var inv = o.invoke;
    o.invoke = function () {
      //console.log("t: ", scheduler.now());
      return inv.apply(this, arguments);
    };
    return o;
  };
  return scheduler;
}

},{"../src/rx-collection":1,"../src/rx-debug":3,"./utils":6,"rx":undefined}],5:[function(require,module,exports){
'use strict';

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _utils = require('./utils');

var _rxDebug = require('../src/rx-debug');

var _rxDebug2 = _interopRequireDefault(_rxDebug);

var _rxCombineOpenGroups = require('../src/rx-combineOpenGroups');

var _rxCombineOpenGroups2 = _interopRequireDefault(_rxCombineOpenGroups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _rxDebug2.default)();
(0, _rxCombineOpenGroups2.default)();

var onNext = _rx.ReactiveTest.onNext,
    onCompleted = _rx.ReactiveTest.onCompleted,
    subscribe = _rx.ReactiveTest.subscribe;

function Marble(data$) {
  return data$.distinctUntilChanged().map(function (data) {
    return 'Marble[' + data.content + '] @ ' + data.time;
  });
}

describe('marble groups', function () {
  var scheduler = new _rx.TestScheduler();

  var marbles = [{
    content: 1,
    diagramId: 0,
    example: "debounce",
    id: 1,
    time: 10
  }, {
    content: 2,
    diagramId: 0,
    example: "debounce",
    id: 2,
    time: 20
  }, {
    content: 3,
    diagramId: 0,
    example: "debounce",
    id: 3,
    time: 30
  }];

  it('should close', function () {
    var input = scheduler.createHotObservable(onNext(100, marbles), onNext(200, marbles.slice(1)));

    var results = scheduler.startScheduler(function () {
      return input.flatMap(function (n) {
        return n;
      }).groupByUntil(function (d) {
        return d.id;
      }, function (v) {
        return v;
      }, function (d) {
        return input.map(function (list) {
          return !list.some(function (ad) {
            return ad.id === d.key;
          });
        }).filter(function (b) {
          return b;
        });
      }).combineOpenGroups(null, Marble).map(function (l) {
        return l.join(", ");
      }).debounce(10, scheduler);
    }, { created: 0, subscribed: 0, disposed: 400 });

    _utils.collectionAssert.assertEqual(results.messages, [onNext(110, ['Marble[1] @ 10', 'Marble[2] @ 20', 'Marble[3] @ 30'].join(", ")), onNext(210, ['Marble[2] @ 20', 'Marble[3] @ 30'].join(", "))]);
  });
});

},{"../src/rx-combineOpenGroups":2,"../src/rx-debug":3,"./utils":6,"rx":undefined}],6:[function(require,module,exports){
'use strict';

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _assert = require('assert');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMessage(expected, actual) {
  return 'Expected: [' + expected.toString() + ']\r\nActual: [' + actual.toString() + ']';
}

module.exports = {
  collectionAssert: {
    assertEqual: function assertEqual(actual, expected) {
      var comparer = _rx2.default.internals.isEqual,
          isOk = true;

      if (expected.length !== actual.length) {
        (0, _assert.fail)('Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        return;
      }

      for (var i = 0, len = expected.length; i < len; i++) {
        isOk = comparer(expected[i], actual[i]);
        if (!isOk) {
          break;
        }
      }

      (0, _assert.ok)(isOk, createMessage(expected, actual));
    }
  }
};

},{"assert":undefined,"rx":undefined}]},{},[5,4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5icmV3L2hvbWVicmV3L2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL3J4LWNvbGxlY3Rpb24uanMiLCJzcmMvcngtY29tYmluZU9wZW5Hcm91cHMuanMiLCJzcmMvcngtZGVidWcuanMiLCJ0ZXN0L2NvbGxlY3Rpb24tcGx1Y2suanMiLCJ0ZXN0L21hcmJsZS1jb25zdHJ1Y3Rpb24uanMiLCJ0ZXN0L3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7a0JDS2UsWUFBVTtBQUN2QixrQkFBZ0IsVUFBaEIsR0FBNkIsVUFBUyxNQUFULEVBQWlCO0FBQzVDLFFBQUksT0FBTyxLQUFLLEtBQUwsRUFBWDtBQUFBLFFBQXlCLFFBQVEsRUFBakM7QUFBQSxRQUFxQyxTQUFTLEVBQTlDOztBQUVBLFFBQUcsT0FBTyxLQUFWLEVBQWlCO0FBQ2YsY0FBUSxPQUFPLElBQVAsQ0FBWSxPQUFPLEtBQW5CLEVBQTBCLEdBQTFCLENBQThCLGlCQUFTO0FBQzdDLFlBQUksVUFBVSxPQUFPLEtBQVAsQ0FBYSxLQUFiLENBQWQ7QUFDQSxZQUFHLE9BQU8sT0FBUCxJQUFrQixVQUFyQixFQUFpQztBQUMvQixpQkFBTyxDQUFDLEtBQUQsRUFBUSxLQUNaLE9BRFksQ0FDSjtBQUFBLG1CQUFRLFFBQVEsSUFBUixDQUFSO0FBQUEsV0FESSxDQUFSLENBQVA7QUFFRCxTQUhELE1BR08sSUFBRyxPQUFPLE9BQVAsSUFBa0IsUUFBckIsRUFBK0I7QUFDcEMsaUJBQU8sQ0FBQyxLQUFELEVBQVEsS0FBSyxPQUFMLENBQWE7QUFBQSxtQkFBUSxLQUFLLE9BQUwsQ0FBUjtBQUFBLFdBQWIsQ0FBUixDQUFQO0FBQ0QsU0FGTSxNQUVBO0FBQ0wsa0JBQVEsSUFBUixDQUFhLDhDQUFiLEVBQTZELEtBQTdEO0FBQ0Q7QUFDRixPQVZPLENBQVI7QUFXRDs7QUFFRCxR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QU8sT0FBUCxHQUFpQjtBQUNmLG9CQUFrQjtBQUNoQixpQkFBYSxxQkFBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCO0FBQ3ZDLFVBQUksV0FBVyxhQUFHLFNBQUgsQ0FBYSxPQUE1QjtBQUFBLFVBQXFDLE9BQU8sSUFBNUM7O0FBRUEsVUFBSSxTQUFTLE1BQVQsS0FBb0IsT0FBTyxNQUEvQixFQUF1QztBQUNyQywwQkFBSyxpQ0FBaUMsU0FBUyxNQUExQyxHQUFtRCxXQUFuRCxHQUFpRSxPQUFPLE1BQTdFO0FBQ0E7QUFDRDs7QUFFRCxXQUFJLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxTQUFTLE1BQTlCLEVBQXNDLElBQUksR0FBMUMsRUFBK0MsR0FBL0MsRUFBb0Q7QUFDbEQsZUFBTyxTQUFTLFNBQVMsQ0FBVCxDQUFULEVBQXNCLE9BQU8sQ0FBUCxDQUF0QixDQUFQO0FBQ0EsWUFBSSxDQUFDLElBQUwsRUFBVztBQUNUO0FBQ0Q7QUFDRjs7QUFFRCxzQkFBRyxJQUFILEVBQVMsY0FBYyxRQUFkLEVBQXdCLE1BQXhCLENBQVQ7QUFDRDtBQWpCZTtBQURILENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBSeCBmcm9tICdyeCc7XG5cbnZhciBPYnNlcnZhYmxlID0gUnguT2JzZXJ2YWJsZSxcbiAgb2JzZXJ2YWJsZVByb3RvID0gT2JzZXJ2YWJsZS5wcm90b3R5cGU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XG4gIG9ic2VydmFibGVQcm90by5jb2xsZWN0aW9uID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgbGV0IHJvb3QgPSB0aGlzLnNoYXJlKCksIG1lcmdlID0gW10sIGxhdGVzdCA9IFtdO1xuICAgIFxuICAgIGlmKGNvbmZpZy5tZXJnZSkge1xuICAgICAgbWVyZ2UgPSBPYmplY3Qua2V5cyhjb25maWcubWVyZ2UpLm1hcChmaWVsZCA9PiB7XG4gICAgICAgIGxldCBtYXBwaW5nID0gY29uZmlnLm1lcmdlW2ZpZWxkXVxuICAgICAgICBpZih0eXBlb2YgbWFwcGluZyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIFtmaWVsZCwgcm9vdFxuICAgICAgICAgICAgLmZsYXRNYXAoaXRlbSA9PiBtYXBwaW5nKGl0ZW0pKV1cbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBtYXBwaW5nID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIFtmaWVsZCwgcm9vdC5mbGF0TWFwKGl0ZW0gPT4gaXRlbVttYXBwaW5nXSldXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwidW5rbm93biBjb2xsZWN0aW9uIG9wZXJhdGlvbiBmb3IgbWVyZ2UtZmllbGRcIiwgZmllbGQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYoY29uZmlnLmxhdGVzdCkge1xuICAgICAgbGF0ZXN0ID0gT2JqZWN0LmtleXMoY29uZmlnLmxhdGVzdCkubWFwKGZpZWxkID0+IHtcbiAgICAgICAgbGV0IG1hcHBpbmcgPSBjb25maWcubGF0ZXN0W2ZpZWxkXVxuICAgICAgICBsZXQgY29tYmluZWQgPSByb290XG4gICAgICAgICAgLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBtYXBwaW5nID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtpbmRleCwgbWFwcGluZyhpdGVtKV1cbiAgICAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgbWFwcGluZyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICByZXR1cm4gW2luZGV4LCBpdGVtW21hcHBpbmddXVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwidW5rbm93biBjb2xsZWN0aW9uIG9wZXJhdGlvbiBmb3IgbGF0ZXN0LWZpZWxkXCIsIGZpZWxkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZsYXRNYXAoKFtpbmRleCwgb2JzXSkgPT4gb2JzLnB1Ymxpc2gobyA9PiBvXG4gICAgICAgICAgICAgIC5maWx0ZXIoXyA9PiBmYWxzZSlcbiAgICAgICAgICAgICAgLmNvbmNhdChPYnNlcnZhYmxlLm9mKFtpbmRleCwgdW5kZWZpbmVkXSkpXG4gICAgICAgICAgICAgIC5zdGFydFdpdGgoW2luZGV4LCBvXSkpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zY2FuKChtZW1vcnksIFtpbmRleCwgb2JzZXJ2YWJsZV0pID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE8gcmVtb3ZlIHVuZGVzaXJlZCBzaGFyZVJlcGxheTogXG4gICAgICAgICAgICAvLyB0aGUgcHVibGlzaCBhYm92ZSBjYXVzZXMgdGhlIG9yaWdpbmFsIHNvdXJjZSBub3QgdG8gcmVwbGF5LFxuICAgICAgICAgICAgLy8gc2luY2UgdGhlIHN1YnNjcmlwdGlvbiBpcyBrZXB0IG9wZW4uXG4gICAgICAgICAgICBtZW1vcnlbaW5kZXhdID0gb2JzZXJ2YWJsZSAmJiBvYnNlcnZhYmxlLnNoYXJlUmVwbGF5KDEpO1xuICAgICAgICAgICAgcmV0dXJuIG1lbW9yeTtcbiAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICAubWFwKGxpc3QgPT4gbGlzdC5maWx0ZXIodiA9PiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCcpKVxuICAgICAgICAgIC5mbGF0TWFwTGF0ZXN0KChsaXN0LCBjKSA9PlxuICAgICAgICAgICAgT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KGxpc3QsICguLi5hcmdzKSA9PiBhcmdzKVxuICAgICAgICAgIClcbiAgICAgICAgcmV0dXJuIFtmaWVsZCwgY29tYmluZWRdXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBtZXJnZS5jb25jYXQobGF0ZXN0KVxuICAgICAgLnJlZHVjZSgob2JqLCBbZmllbGQsIG9ic10pID0+IHtcbiAgICAgICAgb2JqW2ZpZWxkXSA9IG9icztcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH0sIHt9KTtcbiAgfVxufTtcbiIsImltcG9ydCBSeCBmcm9tICdyeCc7XG5cbnZhciBPYnNlcnZhYmxlID0gUnguT2JzZXJ2YWJsZSxcbiAgb2JzZXJ2YWJsZVByb3RvID0gT2JzZXJ2YWJsZS5wcm90b3R5cGU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCl7XG4gIG9ic2VydmFibGVQcm90by5jb21iaW5lT3Blbkdyb3VwcyA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBncm91cFRyYW5zZm9ybSl7XG4gICAgaWYodHlwZW9mIHNlbGVjdG9yID09ICd1bmRlZmluZWQnIHx8IHNlbGVjdG9yID09IG51bGwpIHtcbiAgICAgIHNlbGVjdG9yID0gKHYpID0+IHY7XG4gICAgfVxuICAgIGlmKHR5cGVvZiBncm91cFRyYW5zZm9ybSA9PSAndW5kZWZpbmVkJyB8fCBncm91cFRyYW5zZm9ybSA9PSBudWxsKSB7XG4gICAgICBncm91cFRyYW5zZm9ybSA9ICh2KSA9PiB2O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gICAgICAuZmxhdE1hcChncm91cCA9PiB7XG4gICAgICAgIHJldHVybiBncm91cFRyYW5zZm9ybShncm91cClcbiAgICAgICAgICAubWFwKGl0ZW0gPT4gW2dyb3VwLmtleSwgc2VsZWN0b3IoaXRlbSldKVxuICAgICAgICAgIC5jb25jYXQoUnguT2JzZXJ2YWJsZS5qdXN0KFtncm91cC5rZXksIGZhbHNlXSkpXG4gICAgICB9KVxuICAgICAgLnNjYW4oKG1lbW8sIG5leHQpID0+IHtcbiAgICAgICAgdmFyIGNvcHkgPSBPYmplY3Qua2V5cyhtZW1vKVxuICAgICAgICAgIC5yZWR1Y2UoKG8sIGspID0+IHsgb1trXSA9IG1lbW9ba107IHJldHVybiBvIH0sIHt9KTtcbiAgICAgICAgaWYobmV4dFsxXSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkZWxldGUgY29weVtuZXh0WzBdXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb3B5W25leHRbMF1dID0gbmV4dFsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH0sIHt9KVxuICAgICAgLm1hcChvYmogPT4gT2JqZWN0LmtleXMob2JqKS5tYXAoayA9PiBvYmpba10pKVxuICB9XG59O1xuIiwiaW1wb3J0IFJ4IGZyb20gJ3J4JztcblxudmFyIE9ic2VydmFibGUgPSBSeC5PYnNlcnZhYmxlLFxuICBpbmhlcml0cyA9IFJ4LmludGVybmFscy5pbmhlcml0cyxcbiAgT2JzZXJ2YWJsZUJhc2UgPSBSeC5PYnNlcnZhYmxlQmFzZSxcbiAgRGlzcG9zYWJsZSA9IFJ4LkRpc3Bvc2FibGUsXG4gIEFic3RyYWN0T2JzZXJ2ZXIgPSBSeC5pbnRlcm5hbHMuQWJzdHJhY3RPYnNlcnZlcixcbiAgb2JzZXJ2YWJsZVByb3RvID0gT2JzZXJ2YWJsZS5wcm90b3R5cGU7XG5cbnZhciBEZWJ1Z09ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICBpbmhlcml0cyhEZWJ1Z09ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gIGZ1bmN0aW9uIERlYnVnT2JzZXJ2YWJsZShzb3VyY2UsIGtleSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgfVxuXG4gIERlYnVnT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgRGVidWdPYnNlcnZlcihvLCB0aGlzLl9rZXkpKTtcbiAgICByZXR1cm4gRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3J4LmRlYnVnJywgJ2Rpc3Bvc2UnLCB0aGlzLl9rZXkpO1xuICAgICAgcGFyZW50LmRpc3Bvc2UoKTtcbiAgICB9KVxuICB9O1xuXG4gIHJldHVybiBEZWJ1Z09ic2VydmFibGU7XG59KE9ic2VydmFibGVCYXNlKSk7XG5cbnZhciBEZWJ1Z09ic2VydmVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhEZWJ1Z09ic2VydmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIERlYnVnT2JzZXJ2ZXIobywga2V5KSB7XG4gICAgICBjb25zb2xlLmxvZygncnguZGVidWcnLCAnc3Vic2NyaXB0aW9uJywga2V5KTtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgRGVidWdPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICBjb25zb2xlLmxvZygncnguZGVidWcnLCB0aGlzLl9rZXksICduZXh0JywgeCk7XG4gICAgICB0aGlzLl9vLm9uTmV4dCh4KTtcbiAgICB9O1xuXG4gICAgRGVidWdPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ3J4LmRlYnVnJywgdGhpcy5fa2V5LCAnZXJyb3InLCBlKTtcbiAgICAgIHRoaXMuX28ub25FcnJvcihlKTtcbiAgICB9O1xuXG4gICAgRGVidWdPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ3J4LmRlYnVnJywgdGhpcy5fa2V5LCAnY29tcGxldGVkJyk7XG4gICAgICB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBEZWJ1Z09ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKXtcbiAgb2JzZXJ2YWJsZVByb3RvLmRlYnVnID0gZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gbmV3IERlYnVnT2JzZXJ2YWJsZSh0aGlzLCBrZXkpO1xuICB9XG59O1xuIiwiaW1wb3J0IFJ4LCB7IFJlYWN0aXZlVGVzdCwgVGVzdFNjaGVkdWxlciB9IGZyb20gJ3J4J1xuaW1wb3J0IHsgY29sbGVjdGlvbkFzc2VydCB9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQgYWRkRGVidWcgZnJvbSAnLi4vc3JjL3J4LWRlYnVnJ1xuaW1wb3J0IGFkZE9wZXJhdG9yIGZyb20gJy4uL3NyYy9yeC1jb2xsZWN0aW9uJ1xuYWRkRGVidWcoKVxuYWRkT3BlcmF0b3IoKVxuXG52YXIgb25OZXh0ID0gUmVhY3RpdmVUZXN0Lm9uTmV4dCwgXG4gIG9uQ29tcGxldGVkID0gUmVhY3RpdmVUZXN0Lm9uQ29tcGxldGVkLFxuICBzdWJzY3JpYmUgPSBSZWFjdGl2ZVRlc3Quc3Vic2NyaWJlXG5cbmNvbnN0IG5ldmVyID0gUnguT2JzZXJ2YWJsZS5uZXZlcigpXG5cbmRlc2NyaWJlKCdjb21wb25lbnQgY29sbGVjdGlvbnMnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzY2hlZHVsZXIgPSBpbnN0cnVtZW50U2NoZWR1bGVyKG5ldyBUZXN0U2NoZWR1bGVyKCkpO1xuXG4gIHZhciBjb21wb25lbnRzID0gW3tcbiAgICBET006IFJ4Lk9ic2VydmFibGUub2YoXCJBMVwiLCBcIkEyXCIpLm1lcmdlKG5ldmVyKSxcbiAgICBjbGlja3MkOiBuZXZlclxuICB9LHtcbiAgICBET006IFJ4Lk9ic2VydmFibGUub2YoXCJCMVwiLCBcIkIyXCIsIFwiQjNcIikubWVyZ2UobmV2ZXIpLFxuICAgIGNsaWNrcyQ6IFJ4Lk9ic2VydmFibGUub2YoMSkuZGVsYXkoMiwgc2NoZWR1bGVyKS5tZXJnZShuZXZlcilcbiAgfSx7XG4gICAgRE9NOiBSeC5PYnNlcnZhYmxlLm9mKFwiQzFcIikubWVyZ2UobmV2ZXIpLFxuICAgIGNsaWNrcyQ6IFJ4Lk9ic2VydmFibGUub2YoNCkuZGVsYXkoNSwgc2NoZWR1bGVyKS5tZXJnZShuZXZlcilcbiAgfV07XG5cbiAgY29uc3Qgb3V0cHV0ID0gKCkgPT4gUnguT2JzZXJ2YWJsZVxuICAgICAgLmZyb21BcnJheShjb21wb25lbnRzKVxuICAgICAgLm1lcmdlKG5ldmVyKVxuICAgICAgLmNvbGxlY3Rpb24oe1xuICAgICAgICBsYXRlc3Q6IHtcbiAgICAgICAgICBET006IChpdGVtKSA9PiBpdGVtLkRPTS5zaGFyZVJlcGxheSgxKSxcbiAgICAgICAgfSxcbiAgICAgICAgbWVyZ2U6IHtcbiAgICAgICAgICBjbGlja3MkOiAoaXRlbSkgPT4gaXRlbS5jbGlja3MkLm1hcChpdGVtKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICBcbiAgaXQoJ3Nob3VsZCBjb21iaW5lIGxhdGVzdCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlc3VsdHMgPSBzY2hlZHVsZXIuc3RhcnRTY2hlZHVsZXIoXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvdXRwdXQoKS5ET00uZGVib3VuY2UoMTAsIHNjaGVkdWxlcilcbiAgICAgIH0sIHsgY3JlYXRlZDogMCwgc3Vic2NyaWJlZDogMCwgZGlzcG9zZWQ6IDQwMCB9XG4gICAgKTtcbiAgICBjb2xsZWN0aW9uQXNzZXJ0LmFzc2VydEVxdWFsKHJlc3VsdHMubWVzc2FnZXMsIFtcbiAgICAgICBvbk5leHQoMTEsIFtcIkEyXCIsIFwiQjNcIiwgXCJDMVwiXSlcbiAgICBdKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbWVyZ2Ugc3RyZWFtcycsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlc3VsdHMgPSBzY2hlZHVsZXIuc3RhcnRTY2hlZHVsZXIoXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvdXRwdXQoKS5jbGlja3MkXG4gICAgICB9LCB7IGNyZWF0ZWQ6IDUwMCwgc3Vic2NyaWJlZDogNTAwLCBkaXNwb3NlZDogODAwIH1cbiAgICApO1xuXG4gICAgY29sbGVjdGlvbkFzc2VydC5hc3NlcnRFcXVhbChyZXN1bHRzLm1lc3NhZ2VzLCBbXG4gICAgICBvbk5leHQoNTAyLCBjb21wb25lbnRzWzFdKSxcbiAgICAgIG9uTmV4dCg1MDUsIGNvbXBvbmVudHNbMl0pXG4gICAgXSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNsb3NlJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgc2NoZWR1bGVyID0gaW5zdHJ1bWVudFNjaGVkdWxlcihuZXcgVGVzdFNjaGVkdWxlcigpKTtcblxuICAgIGNvbnN0IG5vdHMgPSBSeC5PYnNlcnZhYmxlXG4gICAgICAubWVyZ2UoXG4gICAgICAgIFJ4Lk9ic2VydmFibGUub2YoWzEsMiwzXSksXG4gICAgICAgIFJ4Lk9ic2VydmFibGUub2YoWzEsMl0pLmRlbGF5KDEwMCwgc2NoZWR1bGVyKVxuICAgICAgKVxuICAgICAgLm1lcmdlKG5ldmVyKVxuXG4gICAgY29uc3QgY29tcHMgPSBub3RzLnB1Ymxpc2gobm90cyA9PiBub3RzXG4gICAgICAuZmxhdE1hcChuID0+IG4pXG4gICAgICAuZ3JvdXBCeVVudGlsKFxuICAgICAgICBkID0+IGQsIFxuICAgICAgICB2ID0+IHYsXG4gICAgICAgIGQgPT4gbm90c1xuICAgICAgICAgIC5tYXAobGlzdCA9PiAhbGlzdC5zb21lKGFkID0+IGFkID09PSBkLmtleSkpXG4gICAgICAgICAgLmZpbHRlcihiID0+IGIpXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5tYXAoZ3JvdXAgPT4gKHsgRE9NOiBncm91cCB9KSlcblxuICAgIHZhciBvdXRwdXQgPSBjb21wc1xuICAgICAgLmNvbGxlY3Rpb24oe1xuICAgICAgICBsYXRlc3Q6IHtcbiAgICAgICAgICBET006IChpdGVtKSA9PiBpdGVtLkRPTS5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHZhciByZXN1bHRzID0gc2NoZWR1bGVyLnN0YXJ0U2NoZWR1bGVyKCgpID0+IG91dHB1dC5ET00sIHsgY3JlYXRlZDogMCwgc3Vic2NyaWJlZDogMCwgZGlzcG9zZWQ6IDEwMDAgfSk7XG5cbiAgICBjb2xsZWN0aW9uQXNzZXJ0LmFzc2VydEVxdWFsKHJlc3VsdHMubWVzc2FnZXMsIFtcbiAgICAgIG9uTmV4dCgxLCBbMV0pLFxuICAgICAgb25OZXh0KDEsIFsxLCAyXSksXG4gICAgICBvbk5leHQoMSwgWzEsIDIsIDNdKSxcbiAgICAgIG9uTmV4dCgxMDEsIFsxLCAyXSlcbiAgICBdKVxuICB9KVxufSk7XG5cbmZ1bmN0aW9uIGluc3RydW1lbnRTY2hlZHVsZXIoc2NoZWR1bGVyKSB7XG4gIHZhciBvcmlnaW5hbCA9IHNjaGVkdWxlci5nZXROZXh0O1xuICBzY2hlZHVsZXIuZ2V0TmV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIG8gPSBvcmlnaW5hbC5jYWxsKHRoaXMpO1xuICAgIGlmKG8gPT0gbnVsbCkgcmV0dXJuIG87XG4gICAgdmFyIGludiA9IG8uaW52b2tlO1xuICAgIG8uaW52b2tlID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vY29uc29sZS5sb2coXCJ0OiBcIiwgc2NoZWR1bGVyLm5vdygpKTtcbiAgICAgIHJldHVybiBpbnYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG87XG4gIH1cbiAgcmV0dXJuIHNjaGVkdWxlcjtcbn1cbiIsImltcG9ydCBSeCwgeyBSZWFjdGl2ZVRlc3QsIFRlc3RTY2hlZHVsZXIgfSBmcm9tICdyeCdcbmltcG9ydCB7IGNvbGxlY3Rpb25Bc3NlcnQgfSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IGFkZERlYnVnIGZyb20gJy4uL3NyYy9yeC1kZWJ1ZydcbmltcG9ydCBhZGRPcGVyYXRvciBmcm9tICcuLi9zcmMvcngtY29tYmluZU9wZW5Hcm91cHMnXG5hZGREZWJ1ZygpXG5hZGRPcGVyYXRvcigpXG5cbnZhciBvbk5leHQgPSBSZWFjdGl2ZVRlc3Qub25OZXh0LCBcbiAgb25Db21wbGV0ZWQgPSBSZWFjdGl2ZVRlc3Qub25Db21wbGV0ZWQsXG4gIHN1YnNjcmliZSA9IFJlYWN0aXZlVGVzdC5zdWJzY3JpYmVcblxuZnVuY3Rpb24gTWFyYmxlKGRhdGEkKSB7XG4gIHJldHVybiBkYXRhJFxuICAgIC5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgLm1hcChkYXRhID0+IGBNYXJibGVbJHtkYXRhLmNvbnRlbnR9XSBAICR7ZGF0YS50aW1lfWApXG59XG5cbmRlc2NyaWJlKCdtYXJibGUgZ3JvdXBzJywgZnVuY3Rpb24gKCkge1xuICB2YXIgc2NoZWR1bGVyID0gbmV3IFRlc3RTY2hlZHVsZXIoKTtcblxuICB2YXIgbWFyYmxlcyA9IFt7XG4gICAgICBjb250ZW50OiAxLFxuICAgICAgZGlhZ3JhbUlkOiAwLFxuICAgICAgZXhhbXBsZTogXCJkZWJvdW5jZVwiLFxuICAgICAgaWQ6IDEsXG4gICAgICB0aW1lOiAxMCxcbiAgICB9LHtcbiAgICAgIGNvbnRlbnQ6IDIsXG4gICAgICBkaWFncmFtSWQ6IDAsXG4gICAgICBleGFtcGxlOiBcImRlYm91bmNlXCIsXG4gICAgICBpZDogMixcbiAgICAgIHRpbWU6IDIwLFxuICAgIH0se1xuICAgICAgY29udGVudDogMyxcbiAgICAgIGRpYWdyYW1JZDogMCxcbiAgICAgIGV4YW1wbGU6IFwiZGVib3VuY2VcIixcbiAgICAgIGlkOiAzLFxuICAgICAgdGltZTogMzAsXG4gICAgfV07XG4gICAgXG4gIGl0KCdzaG91bGQgY2xvc2UnLCBmdW5jdGlvbigpe1xuICAgIHZhciBpbnB1dCA9IHNjaGVkdWxlci5jcmVhdGVIb3RPYnNlcnZhYmxlKFxuICAgICAgb25OZXh0KDEwMCwgbWFyYmxlcyksXG4gICAgICBvbk5leHQoMjAwLCBtYXJibGVzLnNsaWNlKDEpKSxcbiAgICApO1xuXG4gICAgdmFyIHJlc3VsdHMgPSBzY2hlZHVsZXIuc3RhcnRTY2hlZHVsZXIoXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnB1dFxuICAgICAgICAgIC5mbGF0TWFwKG4gPT4gbilcbiAgICAgICAgICAuZ3JvdXBCeVVudGlsKFxuICAgICAgICAgICAgZCA9PiBkLmlkLFxuICAgICAgICAgICAgdiA9PiB2LFxuICAgICAgICAgICAgZCA9PiBpbnB1dFxuICAgICAgICAgICAgICAubWFwKGxpc3QgPT4gIWxpc3Quc29tZShhZCA9PiBhZC5pZCA9PT0gZC5rZXkpKVxuICAgICAgICAgICAgICAuZmlsdGVyKGIgPT4gYilcbiAgICAgICAgICApXG4gICAgICAgICAgLmNvbWJpbmVPcGVuR3JvdXBzKG51bGwsIE1hcmJsZSlcbiAgICAgICAgICAubWFwKGwgPT4gbC5qb2luKFwiLCBcIikpXG4gICAgICAgICAgLmRlYm91bmNlKDEwLCBzY2hlZHVsZXIpXG4gICAgICB9LCB7IGNyZWF0ZWQ6IDAsIHN1YnNjcmliZWQ6IDAsIGRpc3Bvc2VkOiA0MDAgfVxuICAgICk7XG5cbiAgICBjb2xsZWN0aW9uQXNzZXJ0LmFzc2VydEVxdWFsKHJlc3VsdHMubWVzc2FnZXMsIFtcbiAgICAgICBvbk5leHQoMTEwLCBbXG4gICAgICAgIGBNYXJibGVbMV0gQCAxMGAsXG4gICAgICAgIGBNYXJibGVbMl0gQCAyMGAsXG4gICAgICAgIGBNYXJibGVbM10gQCAzMGAsXG4gICAgICBdLmpvaW4oXCIsIFwiKSksXG4gICAgICBvbk5leHQoMjEwLCBbXG4gICAgICAgIGBNYXJibGVbMl0gQCAyMGAsXG4gICAgICAgIGBNYXJibGVbM10gQCAzMGAsXG4gICAgICBdLmpvaW4oXCIsIFwiKSlcbiAgICBdKTtcbiAgfSlcbn0pO1xuIiwiaW1wb3J0IFJ4IGZyb20gJ3J4J1xuaW1wb3J0IHsgb2ssIGZhaWwgfSBmcm9tICdhc3NlcnQnXG5cbmZ1bmN0aW9uIGNyZWF0ZU1lc3NhZ2UoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICByZXR1cm4gJ0V4cGVjdGVkOiBbJyArIGV4cGVjdGVkLnRvU3RyaW5nKCkgKyAnXVxcclxcbkFjdHVhbDogWycgKyBhY3R1YWwudG9TdHJpbmcoKSArICddJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbGxlY3Rpb25Bc3NlcnQ6IHtcbiAgICBhc3NlcnRFcXVhbDogZnVuY3Rpb24gKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgICAgIHZhciBjb21wYXJlciA9IFJ4LmludGVybmFscy5pc0VxdWFsLCBpc09rID0gdHJ1ZTtcblxuICAgICAgaWYgKGV4cGVjdGVkLmxlbmd0aCAhPT0gYWN0dWFsLmxlbmd0aCkge1xuICAgICAgICBmYWlsKCdOb3QgZXF1YWwgbGVuZ3RoLiBFeHBlY3RlZDogJyArIGV4cGVjdGVkLmxlbmd0aCArICcgQWN0dWFsOiAnICsgYWN0dWFsLmxlbmd0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gZXhwZWN0ZWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaXNPayA9IGNvbXBhcmVyKGV4cGVjdGVkW2ldLCBhY3R1YWxbaV0pO1xuICAgICAgICBpZiAoIWlzT2spIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvayhpc09rLCBjcmVhdGVNZXNzYWdlKGV4cGVjdGVkLCBhY3R1YWwpKTtcbiAgICB9XG4gIH1cbn07XG4iXX0=
