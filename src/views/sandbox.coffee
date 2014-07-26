Rx = require 'rx'
Streams = require 'rxmarbles/controllers/streams'
InputStream = require 'rxmarbles/views/input-stream'
FunctionBox = require 'rxmarbles/views/function-box'
Utils = require 'rxmarbles/views/utils'

#
# Responsible for startup and connecting controller streams to the views
#

module.exports = {
  render: ->
    rootElement = document.createElement("div")
    inputStreams = Utils.renderObservableDOMElement(
      Rx.Observable.zipArray(Streams.inputStreams)
        .map((serializedStreams) ->
          return (InputStream.render(s) for s in serializedStreams)
        )
    )
    functionBox = FunctionBox.render("merge")
    outputStream = Utils.renderObservableDOMElement(
      Streams.outputStream
        .map((serializedStream) ->
          return InputStream.render(serializedStream)
        )
    )
    rootElement.appendChild(inputStreams)
    rootElement.appendChild(functionBox)
    rootElement.appendChild(outputStream)
    return rootElement
}
