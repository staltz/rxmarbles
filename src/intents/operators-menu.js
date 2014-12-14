/*
 * OperatorsMenuIntent
 */
var Rx = require('rx');
var replicate = require('rxmarbles/utils').replicate;

var inputClickEvent$ = new Rx.Subject();

function observe(view) {
  replicate(view.click$, inputClickEvent$);
};

var select$ = inputClickEvent$
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
