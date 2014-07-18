React = require 'react'
Streams = require 'rxmarbles/controllers/streams'
InputStream = require 'rxmarbles/views/input-stream'

#
# Responsible for startup and connecting controller streams to the views
#
Body = React.createClass({
  getInitialState: -> {}

  render: ->
    return (
      React.DOM.div(null,
        React.DOM.p(null, "Stream number one")
        InputStream({stream: Streams.s1})
        React.DOM.p(null, "Stream number two")
        InputStream({stream: Streams.s2})
        React.DOM.p(null, "Merged stream:")
        InputStream({stream: Streams.s3})
      )
    )
})

module.exports = Body
