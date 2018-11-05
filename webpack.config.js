const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const github_page_source_path = path.resolve(__dirname, 'src/demo')
const github_page_path = path.resolve(__dirname, 'docs')

const config_base = {
  output: {
    path: github_page_path,
    publicPath: '/',
    filename: 'index.bundle.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },
}

const config_dev = Object.assign({}, config_base, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [github_page_source_path, 'webpack-hot-middleware/client'],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/demo/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})

const config_prod = Object.assign({}, config_base, {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: [github_page_source_path],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/demo/index.html'),
    }),
  ],
})

module.exports = [config_dev, config_prod]
