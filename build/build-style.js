const path = require('path');
const fs = require('fs-extra');
const glob = require('fast-glob');
const less = require('less');
const csso = require('csso');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

/**
 * 主题定制相关
 */
let modifyVars = {};

async function compileLess(lessCodes, paths) {
  const outputs = await Promise.all(
    lessCodes.map((source, index) => {
      return less.render(source, {
          paths: [path.resolve(__dirname, 'node_modules')],
          filename: paths[index],
          javascriptEnabled: true,
          modifyVars
        })
      }
    )
  ).catch(error => {
    console.error('compileLess', error)
  });
  return outputs.map(item => item.css);
}

async function compilePostcss(cssCodes, paths) {
  const postcssConfig = await postcssrc();
  const outputs = await Promise.all(
    cssCodes.map((css, index) =>
      postcss(postcssConfig.plugins).process(css, { from: paths[index] })
    )
  ).catch(error => {
    console.error('compilePostcss', error)
  });

  return outputs.map(item => item.css);
}

async function compileCsso(cssCodes) {
  return cssCodes.map(css => csso.minify(css).css);
}

async function dest(output, paths) {
  await Promise.all(
    output.map((css, index) => fs.writeFile(paths[index].replace('.less', '.css'), css))
  ).catch(error => {
    console.error('dest', error)
  });
}

// compile component css
async function compile() {
  let codes;

  const paths = await glob(
    ['./es/**/*.less', './lib/**/*.less'],
    { absolute: true }
  );

  codes = await Promise.all(
    paths.map(path => fs.readFile(path, 'utf-8'))
  ).catch(error => {
    console.error('compile', error)
  });

  codes = await compileLess(codes, paths);
  codes = await compilePostcss(codes, paths);
  codes = await compileCsso(codes);

  await dest(codes, paths);
}

compile();
