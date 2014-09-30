#
# Important Model-View-Interpreter binding function.
#
module.exports = (model, view, interpreter) ->
  view.observe(model)
  interpreter.observe(view)
  model.observe(interpreter)
  return true
