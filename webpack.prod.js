const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

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
})
