React = require 'react'

#
# Renders a circle or similar shape to represent an emitted item on a stream
#
Marble = React.createClass({
  render: ->
    return (
      React.DOM.li(null, this.props.item.value+" @"+this.props.item.timestamp)
    )
})

module.exports = Marble
