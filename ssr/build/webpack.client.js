/**
 * webpack clinet config
 */
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  mode: 'development',
  entry: resolve('src/client/index'),
  output: {
    filename: 'index.js',
    path: resolve('lib/client'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                loose: true,
                modules: 'auto'
              }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          'plugins': [
            [
              '@babel/plugin-transform-runtime',
            ],
            [
              'transform-class-properties'
            ]
          ]
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
      {
        test: /\.(less)$/,
        sideEffects: true,
        exclude: /(node_modules)/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('@okee-uikit/postcss-var')],
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                noIeCompat: true,
              }
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
        ]
      }
    ]
  }
}