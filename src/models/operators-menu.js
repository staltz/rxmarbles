/*
 * OperatorsMenuModel
 */
var Rx = require('rx');
var Examples = require('rxmarbles/data/examples');
var replicate = require('rxmarbles/utils').replicate;

var inputSelection$ = new Rx.BehaviorSubject();

function observe(intent) {
  replicate(intent.select$, inputSelection$);
};

var examples$ = Rx.Observable.just(Examples);

var defaultExampleKey = window.location.hash.replace("#", "") || "merge";

var selectedExample$ = inputSelection$
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
