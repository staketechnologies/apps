// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

const ENV = process.env.NODE_ENV || 'development';
const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));

module.exports = merge(
  baseConfig(ENV, context),
  {
    devtool: process.env.BUILD_ANALYZE ? 'source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Plasm Network Portal',
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      })
    ]
  }
);
