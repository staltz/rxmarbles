/*
 * Important Model-View-Interpreter binding function.
 */
module.exports = function(model, view, interpreter) {
  view.observe(model);
  interpreter.observe(view);
  model.observe(interpreter);
};
