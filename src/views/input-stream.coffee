React = require 'react'
Rx = require 'rx'
Marble = require 'rxmarbles/views/marble'

#
# Renders a stream meant as an input to the play interaction
#
InputStream = React.createClass({
  getInitialState: ->
    return {
      # A serialized stream is an Array representing some emitted items
      serializedStream: [{timestamp: -1}]
    }

  componentWillMount: ->
    this.props.stream
      .subscribe((serializedStream) =>
        this.setState({serializedStream: serializedStream})
      )

  render: ->
    marbles = [Marble({item: i}) for i in this.state.serializedStream]
    return (
      React.DOM.ul(null, marbles)
    )
})

module.exports = InputStream
