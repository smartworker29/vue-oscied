const path = require('path')
const glob = require('glob-all')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseClientConfig = require('./webpack.client')
const serverConfig = require('./webpack.server')

class TailwindExtractor {
  static extract (content) {
    return content.match(/[A-z0-9-:/]+/g) || []
  }
}

const clientConfig = merge(baseClientConfig, {
  mode: 'production',
  output: {
    filename: 'script/[name].[hash].js',
    publicPath: '/asset/'
  },
  plugins: [
    new VueSSRClientPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: /node_modules/,
          enforce: true
        }
      },
      minChunks: Infinity
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})

module.exports = [
  clientConfig,
  serverConfig
]
