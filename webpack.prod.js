const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    docs: path.resolve(__dirname, 'src/demo'),
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.[hash].js',
  },
  plugins: [
    new CleanWebpackPlugin(['docs']),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/demo/index.html'),
    }),
  ],
})
