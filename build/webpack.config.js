const path = require('path')
const config = require('../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

baseWebpackConfig = {
  entry: config.entry,
  output: {
    path: path.resolve(__dirname, '../', './dist'),
    filename: "js/[name].js",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|svga|swf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: config.cssLoaders
        }
      },
    ].concat(config.styleLoaders, config.htmlLoader)
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.assetsSubDirectory,
        //   ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      'process.constants': config.constants || {}
    }),
  ].concat(config.plugins),
  resolve: {
    extensions: ['.js', '.vue', '.json', 'css', 'sass', 'scss', 'less'],
    alias: Object.assign({
      'vue$': 'vue/dist/vue.esm.js',// 'vue/dist/vue.common.js' for webpack 1
      '@': path.resolve(__dirname, './src'),
    }, config.alias)
  },
  externals: config.externals,
}

module.exports = baseWebpackConfig;