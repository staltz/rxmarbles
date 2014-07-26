#
# Renders a box representing the Reactive function being applied on the input
# streams.
#

module.exports = {
  render: (label) ->
    functionBox = document.createElement("div")
    functionBox.className = "function-box"
    functionBoxLabel = document.createElement("span")
    functionBoxLabel.className = "function-box-label"
    functionBoxLabel.textContent = label
    functionBox.appendChild(functionBoxLabel)
    return functionBox
}
