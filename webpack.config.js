const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

const github_page_source_path = path.resolve(__dirname, 'src/demo');
const github_page_path = path.resolve(__dirname, 'docs');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: [github_page_source_path, 'webpack-hot-middleware/client'],
  output: {
    path: github_page_path,
    filename: 'index.bundle.js',
    // publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/demo/index.html")
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],
    extensions: [".js", ".jsx"]
  },
};
