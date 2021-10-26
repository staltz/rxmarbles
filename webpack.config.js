'use strict';

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      { from: 'src/assets' },
      { from: 'src/index.css' }
    ]
  }),
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  })
]

module.exports = {
  entry: {
    app: './src/app.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
    clean: isProduction
  },

  mode: isProduction ? 'production' : 'development',

  devtool: isProduction ? 'source-map' : 'inline-source-map',

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
