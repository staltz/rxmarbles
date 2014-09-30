#
# OperatorsMenuModel
#
Rx = require 'rx'
Examples = require 'rxmarbles/data/examples'

interpretedSelect$ = new Rx.BehaviorSubject()

observe = (interpreter) ->
  interpreter.select$
    .subscribe((x) -> interpretedSelect$.onNext(x))
  return true

examples$ = Rx.Observable.just(Examples)

defaultExampleKey = window.location.hash.replace("#","") or "merge"

selectedExample$ = interpretedSelect$
  .startWith(defaultExampleKey)
  .filter((key) -> typeof key != "undefined")
  .map((key) ->
    example = Examples[key]
    example.key = key
    return example
  )

module.exports = {
  observe: observe
  examples$: examples$
  selectedExample$: selectedExample$
}
