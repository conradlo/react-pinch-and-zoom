const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './tmp',
  },
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: 'index.[hash].js',
  },
  entry: [path.resolve(__dirname, 'src/demo'), 'webpack-hot-middleware/client'],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/demo/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
