/*
 * OperatorsMenuModel
 */
var Rx = require('rx');
var Examples = require('rxmarbles/data/examples');

var interpretedSelect$ = new Rx.BehaviorSubject();

function observe(interpreter) {
  interpreter.select$
    .subscribe(function(x) { interpretedSelect$.onNext(x); });
};

var examples$ = Rx.Observable.just(Examples);

var defaultExampleKey = window.location.hash.replace("#", "") || "merge";

var selectedExample$ = interpretedSelect$
  .startWith(defaultExampleKey)
  .filter(function(key) { return (typeof key !== "undefined"); })
  .map(function(key) {
    var example = Examples[key];
    example.key = key;
    return example;
  });

module.exports = {
  observe: observe,
  examples$: examples$,
  selectedExample$: selectedExample$
};
