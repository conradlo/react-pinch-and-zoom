import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader'
import './style.scss';

import PinchToZoom from 'lib';
import img_demo_1 from 'demo/img/demo_1.png';

class App extends Component {
  render() {
    return (
      <div className="w3-row">
        <header className="w3-container w3-margin-bottom">
          <h1>React Pinch and Zoom</h1>
        </header>
        <div className="w3-container w3-quarter"></div>
        <PinchToZoom className="w3-half">
          <img src={img_demo_1}/>
        </PinchToZoom>
      </div>
    );
  }
}

App.propTypes = {
};

App.defaultProps = {
};

export default hot(module)(App);