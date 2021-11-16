/**
 * build for css no font-size
 */
const fs = require('fs');
const path = require('path');
const less = require('less');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const csso = require('csso');

const lessIndexPath = path.join(__dirname, '..', 'es/index.less');

async function compileLess (lessPath) {
  return less.render(
    fs.readFileSync(lessPath, 'utf-8'),
    {
      filename: lessPath,
      paths: [path.resolve(__dirname, '..', 'node_modules')],
      javascriptEnabled: true,
      noIeCompat: true,
      modifyVars: {
        '@useDefaultFontSize': false
      }
    }
  )
}

async function compilePostcss (code, path) {
  const postcssConfig = await postcssrc();
  postcssConfig.plugins.splice(1, 1);
  return postcss(postcssConfig.plugins).process(code, { from: path })
}

async function compile() {
  let code = await compileLess(lessIndexPath);
  code = await compilePostcss(code.css, lessIndexPath);
  code = await csso.minify(code.css).css;
  fs.writeFileSync(lessIndexPath.replace('index.less', 'index.non-rem.css'), code);
  fs.writeFileSync(lessIndexPath.replace('es/index.less', 'lib/index.non-rem.css'), code);
}

compile();
