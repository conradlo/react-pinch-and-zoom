import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import './style.scss'

import PinchToZoom from 'PinchToZoom/index.tsx'
import sq from 'demo/img/img_grid_square.jpg'

class App extends Component {
  render() {
    return (
      <div className="w3-row">
        <header className="w3-container w3-margin-bottom">
          <h1>React Pinch and Zoom</h1>
        </header>
        <div className="w3-container w3-quarter" />
        <PinchToZoom className="w3-half">
          <img src={sq} />
        </PinchToZoom>
      </div>
    )
  }
}

App.propTypes = {}

App.defaultProps = {}

export default hot(module)(App)
