/*
 * Important Model-View-Interpreter binding function.
 */
module.exports = function(model, view, interpreter) {
  view.observe(model);
  if (interpreter) {
    interpreter.observe(view);
  }
  model.observe(interpreter);
};
