Rx = require 'rx'
React = require 'react'
Marble = require 'rxmarbles/views/marble'

#
# Renders a stream meant as an input to the play interaction
#
InputStream = React.createClass({
  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  }

  getInitialState: ->
    return {
      # A serialized stream is an Array representing some emitted items
      serializedStream: []
      marblesRangeStream: new Rx.BehaviorSubject(0)
    }

  componentWillMount: ->
    this.setState({serializedStream: this.props.data})
    return true

  componentDidMount: ->
    this.state.marblesRangeStream.onNext(
      this.refs["marbles"]?.getDOMNode()?.clientWidth
    )
    return true

  render: ->
    marbles = this.state.serializedStream
      .map((item) =>
        Marble({item: item, parentWidthStream: this.state.marblesRangeStream})
      )

    return (
      React.DOM.div({className: "stream"},
        React.DOM.div(className: "arrow", null),
        React.DOM.div(className: "arrow-head", null),
        React.DOM.div({className: "marbles", ref: "marbles"}, marbles)
      )
    )
})

module.exports = InputStream
