#
# Responsible for rendering the sandbox element and connecting controller
# streams to the views.
#
Rx = require 'rx'
InputDiagramView = require 'rxmarbles/views/input-diagram'
OperatorBox = require 'rxmarbles/views/operator-box'
OutputDiagramView = require 'rxmarbles/views/output-diagram'
Utils = require 'rxmarbles/views/utils'

streamOfArrayOfLiveInputDiagramStreams = new Rx.BehaviorSubject(null)

createInputDiagramElements = ->
  InputDiagrams = require 'rxmarbles/controllers/input-diagrams'
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
  SelectedExample = require 'rxmarbles/controllers/selected-example'
  return Utils.renderObservableDOMElement(
    SelectedExample.stream
      .map((example) -> OperatorBox.render(example))
  )

createOutputDiagramElement = ->
  OutputDiagram = require 'rxmarbles/controllers/output-diagram'
  return OutputDiagramView.render(OutputDiagram)


module.exports = {
  getStreamOfArrayOfLiveInputDiagramStreams: ->
    return streamOfArrayOfLiveInputDiagramStreams

  render: ->
    rootElement = document.createElement("div")
    rootElement.appendChild(createInputDiagramElements())
    rootElement.appendChild(createOperatorBoxElement())
    rootElement.appendChild(createOutputDiagramElement())
    return rootElement
}
