import React from 'react'
import { render } from 'react-dom'

import App from './App'
import './css/w3.css'

console.log('[src/demo/script.js] ', document.body.clientWidth) // eslint-disable-line no-console
render(<App />, document.getElementById('app'))
