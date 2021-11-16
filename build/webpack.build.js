/**
 * webpack build entry 
 */
const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');

const isMinify = process.argv.indexOf('-p') !== -1;

delete config.serve;

module.exports = merge(config, {
  mode: 'production',
  entry: './es/index.js',
  output: {
    path: path.join(__dirname, '../lib'),
    library: 'okui',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: isMinify ? '[name].min.js' : '[name].js',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
  },
  performance: false,
  optimization: {
    minimize: isMinify
  },
});
