Rx = require 'rx'
InputDiagramView = require 'rxmarbles/views/input-diagram'
FunctionBox = require 'rxmarbles/views/function-box'
Utils = require 'rxmarbles/views/utils'

#
# Responsible for startup and connecting controller streams to the views
#

firstDiagramDataStream = new Rx.Subject()
secondDiagramDataStream = new Rx.Subject()

createInputDiagramElements = ->
  InputDiagrams = require 'rxmarbles/controllers/input-diagrams'
  inputDiagramElements = Utils.renderObservableDOMElement(
    Rx.Observable.combineLatest(InputDiagrams, (args...) -> args)
      .take(1)
      .map((diagrams) ->
        return (InputDiagramView.render(d) for d in diagrams)
      )
      .doAction((diagramViews) -> # TODO generalize me
        diagramViews[0].dataStream.subscribe((z) ->
          firstDiagramDataStream.onNext(z)
        )
        diagramViews[1].dataStream.subscribe((z) ->
          secondDiagramDataStream.onNext(z)
        )
      )
  )
  return inputDiagramElements

createOutputDiagramElement = ->
  OutputDiagram = require 'rxmarbles/controllers/output-diagram'
  outputDiagramElement = Utils.renderObservableDOMElement(
    OutputDiagram
      .map((diagram) ->
        return InputDiagramView.render(diagram)
      )
  )
  return outputDiagramElement

module.exports = {
  getDiagramDataStreams: -> # TODO generalize me
    return [firstDiagramDataStream.asObservable(), secondDiagramDataStream.asObservable()]

  render: ->
    rootElement = document.createElement("div")
    rootElement.appendChild(createInputDiagramElements())
    rootElement.appendChild(FunctionBox.render("merge"))
    rootElement.appendChild(createOutputDiagramElement())
    return rootElement
}
