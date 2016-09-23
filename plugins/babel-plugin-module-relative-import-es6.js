// WebPack would offer the same functionality, but to not 
// add a dependency, simply use this Babel plugin.

// http://stackoverflow.com/questions/31068698/importing-node-modules-from-root-directory-using-es6-and-babel-node
export default function ({types:t}) {
  // get the working directory
  var cwd = process.cwd();
  return {
    visitor: {
      ImportDeclaration (path) {
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

        node.source.value = cwd + '/' + node.source.value.slice(1);
      }
    }
  };
}
