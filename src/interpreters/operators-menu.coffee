#
# OperatorsMenuInterpreter
#
Rx = require 'rx'

clickEvent$ = new Rx.Subject()

observe = (view) ->
  view.click$
    .subscribe((x) -> clickEvent$.onNext(x))
  return true

select$ = clickEvent$
  .filter((event) -> event != null && event.target != null)
  .map((event) -> event.target.hash.replace("#",""))

module.exports = {
  observe: observe
  select$: select$
}
