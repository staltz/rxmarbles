'use strict';

const path = require('path');
// const isProduction = process.env.NODE_ENV === 'production';

const isProduction = false;

module.exports = {
  entry: './src/main.js',

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
