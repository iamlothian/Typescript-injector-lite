var webpack = require('webpack'),
    path = require('path');

var supportedModules = {
  commonjs: 'lodash',
  commonjs2: 'lodash',
  amd: 'lodash',
  root: '_'
}

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'typescript-injector-light.js',
    library: 'typescriptInjectorLight',
    libraryTarget: 'commonjs2'
  },
  externals: {
    inject: supportedModules,
    instantiate: supportedModules,
    importValue: supportedModules,
    service: supportedModules,
    factory: supportedModules
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
    new webpack.optimize.UglifyJsPlugin()
  ]
};