// WebPack would offer the same functionality, but to not 
// add a dependency, simply use this Babel plugin.

import path from 'path'
const debug = false;

// http://stackoverflow.com/questions/31068698/importing-node-modules-from-root-directory-using-es6-and-babel-node
export default function ({types:t}) {
  return {
    visitor: {
      ImportDeclaration (nodePath, state) {
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
        const importsrc = node.source.value.slice(1)
        const source = path.dirname(state.file.opts.filename);
        const dest = path.join('./src', importsrc)
        var relative = path.relative(source, dest)
        if (relative.indexOf(".") != 0) {
          relative = "./" + relative
        }

        debug && console.log("rewriting", source, "->", dest, "=", relative)
        node.source.value = relative
      }
    }
  };
}
