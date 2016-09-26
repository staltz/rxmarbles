'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(nodePath, state) {
        var node = nodePath.node;
        // probably always true, but let's be safe
        if (!t.isLiteral(node.source)) {
          return;
        }

        var ref = node.source.value;

        // ensure a value, make sure it's not home relative e.g. ~/foo
        if (!ref || ref[0] !== '~' || ref[1] === '/') {
          return;
        }

        // create relative ref
        var importsrc = node.source.value.slice(1);
        var source = _path2.default.dirname(state.file.opts.filename);
        var dest = _path2.default.join('./src', importsrc);
        var relative = _path2.default.relative(source, dest);
        if (relative.indexOf(".") != 0) {
          relative = "./" + relative;
        }

        debug && console.log("rewriting", source, "->", dest, "=", relative);
        node.source.value = relative;
      }
    }
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = false;

// http://stackoverflow.com/questions/31068698/importing-node-modules-from-root-directory-using-es6-and-babel-node
// WebPack would offer the same functionality, but to not 
// add a dependency, simply use this Babel plugin.
