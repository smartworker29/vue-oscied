const path = require('path')
const webpack = require('webpack')
const TscofigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const config = require('../config')
const resolve = (file) => path.resolve(__dirname, file)

module.exports = {
  context: path.resolve(__dirname, '../'),
  output: {
    path: resolve('../dist')
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.css', '.js', '.ts', '.vue'],
    plugins: [
      new TscofigPathsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          'vue-style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(config.env),
      'process.env.VUE_APP_API_ENDPOINT_URL': JSON.stringify(config.api),
      'process.env.VUE_APP_I18N_LOCALE': JSON.stringify(config.locale),
      'process.env.VUE_APP_I18N_FALLBACK_LOCALE': JSON.stringify(config.fallback_locale)
    }),
    new VueLoaderPlugin()
  ]
}
