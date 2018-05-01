import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader'
import './style.scss';

import PinchToZoom from 'lib';
import Img_demo_1 from 'demo/img/demo_1.png';

class App extends Component {
  render() {
    return (
      <div>
        <h1>React Pinch and Zoom (HMR)</h1>
        <PinchToZoom> 
          <img className="inner-container" src={Img_demo_1}/>
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