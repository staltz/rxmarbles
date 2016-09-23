'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  // get the working directory
  var cwd = process.cwd() + "/es6";
  console.log("Rewriting relative to ", cwd);
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;
        // probably always true, but let's be safe
        if (!t.isLiteral(node.source)) {
          return;
        }

        var ref = node.source.value;

        // ensure a value, make sure it's not home relative e.g. ~/foo
        if (!ref || ref[0] !== '~' || ref[1] === '/') {
          return;
        }

        var next = cwd + '/' + node.source.value.slice(1);
        console.log("rewritten", node.source.value, "to", next)
        node.source.value = next;
      }
    }
  };
};
