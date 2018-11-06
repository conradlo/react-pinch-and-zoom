const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    lib: path.resolve(__dirname, 'src/PinchToZoom/index.tsx'),
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
  },
  externals: [
    {
      react: 'react',
      'prop-types': 'prop-types',
    },
  ],
  plugins: [new CleanWebpackPlugin(['lib'])],
})
