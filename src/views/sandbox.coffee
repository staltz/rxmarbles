React = require 'react'
InputStream = require 'rxmarbles/views/input-stream'

#
# Responsible for startup and connecting controller streams to the views
#
Sandbox = React.createClass({
  getInitialState: -> {}

  render: ->
    return (
      React.DOM.div(null,
        [InputStream({serializedStream: s}) for s in this.props.streams]
      )
    )
})

module.exports = Sandbox
