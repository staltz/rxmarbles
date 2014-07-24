React = require 'react'
Rx = require 'rx'
InputStream = require 'rxmarbles/views/input-stream'
Streams = require 'rxmarbles/controllers/streams'

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
        [InputStream({data: s}) for s in this.state.serializedInputStreams]
        InputStream({data: this.state.serializedOutputStream})
      )
    )
})

module.exports = Sandbox
