const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const common = require('./webpack.common.js')

const github_page_source_path = path.resolve(__dirname, 'src/demo')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.[hash].js',
  },
  entry: [github_page_source_path, 'webpack-hot-middleware/client'],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/demo/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
