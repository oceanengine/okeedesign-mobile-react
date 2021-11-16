/**
 * build for css variables
 */
const fs = require('fs');
const path = require('path');
const less = require('less');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const csso = require('csso');
const LessVarMark = require('@okee-uikit/less-var-mark');
const { lessVars, lessMap } = require('./utils/lessConfig');

const lessIndexPath = path.join(__dirname, '..', 'es/index.less');

async function compileLess (lessPath) {
  return less.render(
    fs.readFileSync(lessPath, 'utf-8'),
    {
      filename: lessPath,
      paths: [path.resolve(__dirname, '..', 'node_modules')],
      javascriptEnabled: true,
      noIeCompat: true,
      modifyVars: lessVars,
      plugins: [
        new LessVarMark(lessVars, lessMap)
      ]
    }
  )
}

async function compilePostcss (code, path) {
  const postcssConfig = await postcssrc();
  postcssConfig.plugins.push(require('@okee-uikit/postcss-var'))
  return postcss(postcssConfig.plugins).process(code, { from: path })
}

async function compile() {
  let code = await compileLess(lessIndexPath);
  code = await compilePostcss(code.css, lessIndexPath);
  code = await csso.minify(code.css).css;
  fs.writeFileSync(lessIndexPath.replace('index.less', 'index.css-variable.css'), code);
  fs.writeFileSync(lessIndexPath.replace('es/index.less', 'lib/css_variable.css'), code);
  fs.writeFileSync(lessIndexPath.replace('es/index.less', 'lib/index.css-variable.css'), code);
}

compile();
