/**
 * Build style entry of all components
 */

const fs = require('fs-extra');
const path = require('path');
const dependencyTree = require('dependency-tree');
const components = fs.readdirSync(path.resolve(__dirname, '../src/components'));

// replace seq for windows
function replaceSeq(path) {
  return path.split(path.sep).join('/');
}

const whiteList = [];

const dir = path.join(__dirname, '../es/components');

function destEntryFile(component, filename, ext = '') {
  const deps = analyzeDependencies(component).map(dep =>
    getStyleRelativePath(component, dep, ext)
  );

  const esEntry = path.join(dir, component, `style/${filename}`);
  const libEntry = path.join(
    __dirname,
    '../lib/components',
    component,
    `style/${filename}`
  );

  const esContent = deps.map(dep => `import '${dep}';`).join('\n');
  const libContent = deps.map(dep => `require('${dep}');`).join('\n');

  fs.outputFileSync(esEntry, esContent);
  fs.outputFileSync(libEntry, libContent);
}

// analyze component dependencies
function analyzeDependencies(component) {
  const checkList = ['index'];
  search(
    dependencyTree({
      directory: dir,
      filename: path.join(dir, component, 'index.js'),
      filter: path => !~path.indexOf('node_modules')
    }),
    component,
    checkList
  );

  if (!whiteList.includes(component)) {
    checkList.push(component);
  }

  return checkList.filter(item => checkComponentHasStyle(item));
}

function search(tree, component, checkList) {
  Object.keys(tree).forEach(key => {
    search(tree[key], component, checkList);
    components
      .filter(item =>
        key
          .replace(dir, '')
          .split('/')
          .includes(item)
      )
      .forEach(item => {
        if (
          !checkList.includes(item) &&
          !whiteList.includes(item) &&
          item !== component
        ) {
          checkList.push(item);
        }
      });
  });
}

function getStylePath(component, ext = '.css') {
  if (component === 'index') {
    return path.join(__dirname, `../es/style/index${ext}`);
  }
  return path.join(__dirname, `../es/components/${component}/index${ext}`);
}

function getStyleRelativePath(component, style, ext) {
  return replaceSeq(
    path.relative(
      path.join(__dirname, `../es/components/${component}/style`),
      getStylePath(style, ext)
    )
  );
}

function checkComponentHasStyle(component) {
  return fs.existsSync(getStylePath(component));
}

components.forEach(component => {
  // css entry
  destEntryFile(component, 'css.js', '.css');
  // less entry
  destEntryFile(component, 'index.js', '.less');
});
