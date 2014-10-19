/*
 * SandboxModel
 */
var Rx = require('rx');
var OperatorsMenuModel = require('rxmarbles/models/operators-menu');
var SandboxInput = require('rxmarbles/models/sandbox-input');
var SandboxOutput = require('rxmarbles/models/sandbox-output');
var replicate = require('rxmarbles/utils').replicate;

var inputMarbleDelta$ = new Rx.Subject();
var inputCompletionDelta$ = new Rx.Subject();

function observe(intent) {
  replicate(intent.marbleDelta$, inputMarbleDelta$);
  replicate(intent.completionDelta$, inputCompletionDelta$);
}

var example$ = OperatorsMenuModel.selectedExample$;
var inputDiagrams$ = SandboxInput.getInputDiagrams$(
  example$, inputMarbleDelta$, inputCompletionDelta$
);
var outputDiagram$ = SandboxOutput.getOutputDiagram$(example$, inputDiagrams$);

module.exports = {
  observe: observe,
  example$: example$,
  inputDiagrams$: inputDiagrams$,
  outputDiagram$: outputDiagram$
};
