/**
 * 自动生成 SVG 图标引入文件
 */
const fs = require('fs');
const path = require('path');
const uppercamelize = require('uppercamelcase');

const iconDir = path.resolve(__dirname, '../src/components/icon');
const svgDir = path.resolve(iconDir, 'svg');

const icons = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

const content = [
  '/* eslint-disable */',
  '// this file is auto generated by build/build-icons.js',
  '',
  'export interface IconMap {',
  ...icons.map(file => `  ${uppercamelize(file.replace(/\.svg$/, ''))}: string;`),
  '}',
  '',
  'export const allIcons: IconMap = {',
  ...icons.map(
    file =>
      `  ${uppercamelize(file.replace(/\.svg$/, ''))}: \`${fs.readFileSync(path.resolve(svgDir, file))}\`,`,
  ),
  '};',
  '',
].join('\n');

fs.writeFileSync(path.resolve(iconDir, 'all.ts'), content);
