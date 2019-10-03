const merge = require('webpack-merge')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const baseConfig = require('./webpack.client')
const config = require('../config/dev')

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    publicPath: config.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  serve: {
    host: config.host,
    port: config.port,
    dev: {
      publicPath: config.publicPath
    },
    add: (app, middleware, options) => {
      app.use(convert(history()))
    }
  }
})
