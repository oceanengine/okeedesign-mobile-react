/**
 * webpack basic config
 */
const path = require('path');

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", '.css', 'less']
  },
  module: {
    rules: [{
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          rootMode: 'upward'
        }
      }
    },
    {
      test: /\.(css|less)$/,
      sideEffects: true,
      include: /(node_modules)/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            paths: [path.resolve(__dirname, 'node_modules')],
            javascriptEnabled: true,
            noIeCompat: true,
          },
        },
      ],
    },
    {
      test: /\.(css|less)$/,
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
            paths: [path.resolve(__dirname, 'node_modules')],
            javascriptEnabled: true,
            noIeCompat: true,
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      loader: 'url-loader'
    }]
  }
};
