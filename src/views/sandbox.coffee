#
# Responsible for rendering the sandbox element and connecting controller
# streams to the views.
#
Rx = require 'rx'
h = require 'hyperscript'
InputDiagramView = require 'rxmarbles/views/input-diagram'
OperatorBox = require 'rxmarbles/views/operator-box'
OutputDiagramView = require 'rxmarbles/views/output-diagram'
Utils = require 'rxmarbles/views/utils'

streamOfArrayOfLiveInputDiagramStreams = new Rx.BehaviorSubject(null)

createInputDiagramElements = ->
  InputDiagrams = require 'rxmarbles/models/input-diagrams'
  inputDiagramElements = Utils.renderObservableDOMElement(
    InputDiagrams.initial$
      .map((diagrams) ->
        return (InputDiagramView.render(d) for d in diagrams)
      )
      .doAction((diagramViews) ->
        streamOfArrayOfLiveInputDiagramStreams.onNext(
          (diagram.dataStream for diagram in diagramViews)
        )
      )
  )
  return inputDiagramElements

createOperatorBoxElement = ->
  # TODO change this with SandboxModel.operator$
  OperatorsMenuModel = require 'rxmarbles/models/operators-menu'
  return Utils.renderObservableDOMElement(
    OperatorsMenuModel.selectedExample$
      .map((example) -> OperatorBox.render(example))
  )

createOutputDiagramElement = ->
  OutputDiagram = require 'rxmarbles/models/output-diagram'
  return OutputDiagramView.render(OutputDiagram)


module.exports = {
  getStreamOfArrayOfLiveInputDiagramStreams: ->
    return streamOfArrayOfLiveInputDiagramStreams

  render: ->
    return h("div.sandbox", [
      createInputDiagramElements()
      createOperatorBoxElement()
      createOutputDiagramElement()
    ])
}
