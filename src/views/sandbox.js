/*
 * SandboxView
 */
var Rx = require('rx');
var h = require('virtual-hyperscript');
var SandboxInput = require('rxmarbles/views/sandbox-input');
var SandboxOperator = require('rxmarbles/views/sandbox-operator');
var SandboxOutput = require('rxmarbles/views/sandbox-output');
var replicate = require('rxmarbles/utils').replicate;

var modelExample$ = new Rx.BehaviorSubject();
var modelInputDiagrams$ = new Rx.BehaviorSubject();
var modelOutputDiagram$ = new Rx.BehaviorSubject();
var marbleMouseDown$ = new Rx.Subject();
var completionMouseDown$ = new Rx.Subject();

function observe(model) {
  replicate(model.example$, modelExample$);
  replicate(model.inputDiagrams$, modelInputDiagrams$);
  replicate(model.outputDiagram$, modelOutputDiagram$);
}

var vtree$ = Rx.Observable
  .combineLatest(modelExample$, modelInputDiagrams$, modelOutputDiagram$,
    function(example, inputDiagrams, outputDiagram) {
      return h("div.sandbox", [
        SandboxInput.vrender(inputDiagrams, marbleMouseDown$, completionMouseDown$),
        SandboxOperator.vrender(example),
        SandboxOutput.vrender(outputDiagram)
      ]);
    }
  );

module.exports = {
  observe: observe,
  vtree$: vtree$,
  marbleMouseDown$: marbleMouseDown$,
  completionMouseDown$: completionMouseDown$
};
