Rx = require 'rx'
React = require 'react'

#
# Renders a circle or similar shape to represent an emitted item on a stream
#

NUM_COLORS = 4
Marble = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
    parentWidthStream: React.PropTypes.instanceOf(Rx.Observable)
  }

  getInitialState: ->
    return {
      pos: this.props.item.time
      dragging: false
      lastX: 0
      pxToPercentage: 0
    }

  componentWillMount: ->
    this.props.parentWidthStream
      .subscribe((width) =>
        this.setState({pxToPercentage: 100.0/width}) unless width <= 0
      )
    return true

  componentDidUpdate: (props, state) ->
    if (this.state.dragging and not state.dragging)
      document.addEventListener("mousemove", this.onMouseMove)
      document.addEventListener("mouseup", this.onMouseUp)
    else if (not this.state.dragging and state.dragging)
      document.removeEventListener("mousemove", this.onMouseMove)
      document.removeEventListener("mouseup", this.onMouseUp)
    return true

  onMouseDown: (e) ->
    return if e.button isnt 0
    this.setState({dragging: true, lastX: e.pageX})
    e.stopPropagation()
    e.preventDefault()
    return true

  onMouseMove: (e) ->
    return if not this.state.dragging
    dx = e.pageX - this.state.lastX
    newPos = this.state.pos + dx*this.state.pxToPercentage
    newPos = 0 if newPos < 0
    newPos = 100 if newPos > 100
    this.setState({pos: newPos, lastX: e.pageX})
    e.stopPropagation()
    e.preventDefault()
    return true

  onMouseUp: (e) ->
    this.setState({dragging: false})
    e.stopPropagation()
    e.preventDefault()
    return true

  render: ->
    item = this.props.item
    colornum = (item.id % NUM_COLORS) + 1
    roundedPos = Math.round(this.state.pos)+"%"

    return (
      React.DOM.div(
        {
          className: "marble-container",
          style: {left: roundedPos},
          onMouseDown: this.onMouseDown
        },
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
