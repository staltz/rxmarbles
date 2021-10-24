'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const gitPackage = require('./package.json');

const rxjsVersion = gitPackage.devDependencies.rxjs;
// Unused var:
// const appVersion = gitPackage.version;

let plugins = [
  new webpack.DefinePlugin({
    RXJS_VERSION: `"${rxjsVersion}"`,
  }),

  new CopyWebpackPlugin({
    patterns: [
      { from: 'src/index.html' },
      { from: 'src/index.css' }
    ]
  }),
]

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  mode: isProduction ?
    'production' :
    'development',

  devtool: isProduction ?
    'source-map' :
    'inline-source-map',

  devServer: {
    historyApiFallback: true
  },

  plugins,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    ],
  }
};
