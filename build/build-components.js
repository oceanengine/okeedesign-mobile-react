/**
 * Compile components
 */
const fs = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');

const esDir = path.join(__dirname, '../es');
const libDir = path.join(__dirname, '../lib');
const babelConfig = {
  configFile: path.join(__dirname, '../babel.config.js')
};

const scriptRegExp = /\.(ts|tsx|js|jsx)$/;
const isDeclaration = path => /(\.d\.ts)$/.test(path);
const isCode = path => !/(demo|test|\.md|\.mdx|\.d\.ts)$/.test(path);
const isDir = dir => fs.lstatSync(dir).isDirectory();
const isScript = path => scriptRegExp.test(path);

function compile(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);

    // save .d.ts
    if (isDeclaration(file)) {
      return
    }

    // remove unnecessary files
    if (!isCode(file)) {
      return fs.removeSync(filePath);
    }

    // scan dir
    if (isDir(filePath)) {
      return compile(filePath);
    }

    // compile js or ts
    if (isScript(file)) {
      const { code } = babel.transformFileSync(filePath, babelConfig);
      fs.removeSync(filePath);
      fs.outputFileSync(filePath.replace(scriptRegExp, '.js'), code);
    }
  });
}

compile(esDir);

process.env.BABEL_MODULE = 'commonjs';
compile(libDir);
