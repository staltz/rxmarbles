Rx = require 'rx'
Streams = require 'rxmarbles/controllers/streams'
InputDiagram = require 'rxmarbles/views/input-diagram'
FunctionBox = require 'rxmarbles/views/function-box'
Utils = require 'rxmarbles/views/utils'

#
# Responsible for startup and connecting controller streams to the views
#

module.exports = {
  render: ->
    rootElement = document.createElement("div")
    inputDiagrams = Utils.renderObservableDOMElement(
      Rx.Observable.zipArray(Streams.inputDiagrams)
        .map((diagrams) ->
          return (InputDiagram.render(d) for d in diagrams)
        )
    )
    functionBox = FunctionBox.render("merge")
    outputDiagram = Utils.renderObservableDOMElement(
      Streams.outputDiagram
        .map((diagram) ->
          return InputDiagram.render(diagram)
        )
    )
    rootElement.appendChild(inputDiagrams)
    rootElement.appendChild(functionBox)
    rootElement.appendChild(outputDiagram)
    return rootElement
}
