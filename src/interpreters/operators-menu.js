/*
 * OperatorsMenuInterpreter
 */
var Rx = require('rx');

var clickEvent$ = new Rx.Subject();

function observe(view) {
  view.click$
    .subscribe(function(x) { return clickEvent$.onNext(x); });
};

var select$ = clickEvent$
  .filter(function(event) {
    return event !== null && event.target !== null;
  })
  .map(function(event) {
    return event.target.hash.replace("#", "");
  });

module.exports = {
  observe: observe,
  select$: select$
};
