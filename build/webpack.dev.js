const merge = require('webpack-merge')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const baseConfig = require('./webpack.client')

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    publicPath: '/'
  }
})
