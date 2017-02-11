'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const gitPackage = require('./package.json');

const rxjsVersion = gitPackage.devDependencies.rxjs;
const appVersion = gitPackage.version;

let plugins = [
  new webpack.DefinePlugin({
    RXJS_VERSION: `"${rxjsVersion}"`,
  }),

  new CopyWebpackPlugin([
    { from: 'src/index.html' },
    { from: 'src/index.css' },
  ]),
]

if (isProduction) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]);
}

module.exports = {
  entry: './src/app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },

  devtool: isProduction ?
    'source-map' :
    'inline-source-map',

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: {},
    host: '0.0.0.0',
  },

  plugins: plugins,

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        }
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
    ],
  },

  resolve: {
    extensions: ['', '.js']
  }
};
