/**
 * webpack server config
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  target: 'node',
  mode: 'development',
  entry: resolve('src/server/index'),
  output: {
    filename: 'index.js',
    path: resolve('lib/server'),
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                loose: true,
                modules: 'commonjs',
                targets: {
                  esmodules: false,
                  node: 'current',
                },
                useBuiltIns: 'usage',
              }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          'plugins': [
            [
              '@babel/plugin-transform-runtime'
            ],
            [
              'transform-class-properties'
            ]
          ]
        }
      },
      {
        test: /\.less$/,
        use: [
          'null-loader'
        ]
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
    ]
  }
}