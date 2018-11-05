const express = require('express')
const morgan = require('morgan')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack_config = require('./webpack.config.js')

const compiler = webpack(webpack_config)

const app = express()
app.use(morgan('tiny'))

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler))

app.use(webpackHotMiddleware(compiler))

// Serve the files on port 3000.
app.listen(3000, function() {
  console.log('app listening on port 3000\n')
})
