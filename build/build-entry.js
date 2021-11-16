/** 
 * 自动生成全局样式入口文件
 * index.less && index.tsx
 */
const fs = require('fs');
const path = require('path');
const uppercamelize = require('uppercamelcase');
const packageJson = require('../package.json');

const commonPath = '../src/components';
const components = fs.readdirSync(path.resolve(__dirname, commonPath));

const styleList = components
  .filter(name => fs.existsSync(
    path.resolve(__dirname, `${commonPath}/${name}/index.less`)
  ))
  .map(name => `@import './components/${name}/index';`);

fs.writeFileSync(path.join(__dirname, '../src/index.less'),
`// This file is auto gererated by build/build-entry.js
@import './style/index';
@import './style/root';
${styleList.join('\n')}
`
);

const version = process.env.VERSION || packageJson.version;
const exportList = components.map(name => 
  `export { default as ${uppercamelize(name)} } from './components/${name}/index';`
);

fs.writeFileSync(path.join(__dirname, '../src/index.tsx'),
`// This file is auto gererated by build/build-entry.js
const version = '${version}';
export default { version };
export * from './props-type';
${exportList.join('\n')}
`
);
