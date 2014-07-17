React = require 'react'

RxMarblesApp = React.createClass({

  getInitialState: -> {}

  render: ->
    return (
      React.DOM.div(null,
        React.DOM.p(null, "Hello World! :)")
      )
    )
})

module.exports = RxMarblesApp
