/**
 * 创建产出目录
 */
const fs = require('fs-extra');
const path = require('path');

const esDir = path.join(__dirname, '../es');
const libDir = path.join(__dirname, '../lib');
const srcDir = path.join(__dirname, '../src');

// clear dir
fs.emptyDirSync(esDir);
fs.emptyDirSync(libDir);

// copy dir
fs.copySync(srcDir, esDir);
fs.copySync(srcDir, libDir);
