Rx = require 'rx'
React = require 'react'
Streams = require 'rxmarbles/controllers/streams'
InputStream = require 'rxmarbles/views/input-stream'
FunctionBox = require 'rxmarbles/views/function-box'

#
# Responsible for startup and connecting controller streams to the views
#
Sandbox = React.createClass({
  getInitialState: ->
    return {
      serializedInputStreams: []
      serializedOutputStream: null
    }

  componentWillMount: ->
    Rx.Observable.zipArray(Streams.inputStreams)
      .subscribe((serializedStreams) =>
        this.setState({serializedInputStreams: serializedStreams})
      )

    Streams.outputStream
      .subscribe((serializedStream) =>
        this.setState({serializedOutputStream: serializedStream})
      )
    return true

  render: ->
    return (
      React.DOM.div(null,
        [InputStream({data: s}) for s in this.state.serializedInputStreams],
        FunctionBox({label: "merge"}),
        InputStream({data: this.state.serializedOutputStream})
      )
    )
})

module.exports = Sandbox
