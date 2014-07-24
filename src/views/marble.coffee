React = require 'react'

#
# Renders a circle or similar shape to represent an emitted item on a stream
#

NUM_COLORS = 4
Marble = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  }

  render: ->
    item = this.props.item
    colornum = (item.id % NUM_COLORS) + 1

    return (
      React.DOM.div({className: "marble-container", style: {left: "#{item.time}%"}},
        React.DOM.svg({className: "marble", viewBox: "0 0 1 1"},
          React.DOM.circle({
            cx: 0.5, cy: 0.5, r: 0.5,
            className: "marble marble-color-#{colornum}"
            style: {"stroke-width": "0.07"}
          })
        ),
        React.DOM.p({className: "marble-content"}, item.content)
      )
    )
})

module.exports = Marble
