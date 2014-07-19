React = require 'react'

#
# Renders a circle or similar shape to represent an emitted item on a stream
#

NUM_COLORS = 4
Marble = React.createClass({
  render: ->
    item = this.props.item
    colornum = (this.props.item.id % NUM_COLORS) + 1

    return (
      React.DOM.li(
        {
          className: "marble marble-color-#{colornum}",
          style: {left: "#{item.time}%"}
        },
        item.content
      )
    )
})

module.exports = Marble
