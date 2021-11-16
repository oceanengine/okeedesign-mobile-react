/**
 * webpack mobile
 */
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.base');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = merge(config, {
  mode: 'development',
  entry: {
    'index': resolve('docs/mobile/index'),
  },
  output: {
    path: resolve('/docs/dist'),
    publicPath: '/',
    chunkFilename: 'async_[name].js'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8094,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'docs/mobile/template.html',
      filename: 'index.html',
      inject: false
    })
  ],
});
