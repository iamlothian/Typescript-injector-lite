var webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    filename: './dist/index.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    loaders: [
      { test: /.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },
  plugins: [
    //new UglifyJSPlugin()
  ]
};