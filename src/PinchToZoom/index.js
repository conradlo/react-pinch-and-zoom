/**
 * PinchToZoom react componenets
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import './PinchToZoom.scss';

class PinchToZoom extends Component {

  /*
    helper method
  */
  static getTouchesCoordinate(syntheticEvent) {
    const coordinates = []; // [x1, y1, x2, y2...]
    const eventTargetNode = syntheticEvent.currentTarget; // DOM node
    const targetBounchRect = eventTargetNode.parentNode.getBoundingClientRect();
    const touchList = syntheticEvent.nativeEvent.touches; // DOM touch list
    for (let i = 0; i < touchList.length; i += 1) {
      const touch = touchList.item(i);
      coordinates.push(touch.clientX - targetBounchRect.left);
      coordinates.push(touch.clientY - targetBounchRect.top);
    }
    return coordinates;
  }

  static calculateDistance({ x1, y1 }, { x2, y2 }) {
    // Pythagorean Theorem: c^2 = a^2 + b^2
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  static calculateMidpoint({ x1, y1 }, { x2, y2 }) {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  /*
    React constructure
  */

  constructor(props) {
    super(props);

    // instance variable: transform data
    this.transform = {};
    this.transform.zoomFactor = 1.0;
    this.transform.translate = {
      x: 0.0,
      y: 0.0,
    };

    // instance variable: guesture
    this.currentGesture = 'unknown'; // 'pinch', 'pan', 'unknown'

    // instance variable: pinch
    this.pinchStartZoomFactor = 1.0;
    this.pinchStartTouchMidpoint = { x: 0, y: 0 };
    this.pinchStartTranslate = { x: 0, y: 0 };
    this.pinchStartTouchPointDist = 0;

    // instance variable: pan
    this.panStartPoint = { x: 0, y: 0 };
    this.panStartTranslate = { x: 0, y: 0 };

    // record last touch point
    this.state = {
      lastSingleTouchPoint: { x: 0, y: 0 },
    };
  }

  componentDidMount() {
    this.zoomContentArea(this.props.minZoomScale);
    this.guardZoomAreaTranslate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.minZoomScale !== this.props.minZoomScale
        || prevProps.boundSize.height !== this.props.boundSize.height) {
      // console.log('componentDidUpdate@prevProps', prevProps);
      // console.log('componentDidUpdate@currentProps', this.props);
      this.zoomContentArea(this.props.minZoomScale);
      this.guardZoomAreaTranslate();
    }
  }
  /*
    Pinch event handlers
  */

  onPinchStart(syntheticEvent) {
    syntheticEvent.preventDefault();

    const [x1, y1, x2, y2] = PinchToZoom.getTouchesCoordinate(syntheticEvent);

    // on pinch start remember the mid point of 2 touch points
    this.pinchStartTouchMidpoint = PinchToZoom.calculateMidpoint({ x1, y1 }, { x2, y2 });

    // on pinch start remember the distance of 2 touch points
    this.pinchStartTouchPointDist = PinchToZoom.calculateDistance({ x1, y1 }, { x2, y2 });

    /*
      on pinch start, remember the `origianl zoom factor`
      & `origianl plan translate` before pinching
    */
    const { currentZoomFactor, currentTranslate } = this.getTransform();
    this.pinchStartZoomFactor = currentZoomFactor;
    this.pinchStartTranslate = currentTranslate;
  }

  onPinchMove(syntheticEvent) {
    syntheticEvent.preventDefault();

    // get lastest touch point coordinate
    const [x1, y1, x2, y2] = PinchToZoom.getTouchesCoordinate(syntheticEvent);

    // const pinchCurrentTouchMidpoint = SeatingPlan.calculateMidpoint({ x1, y1 }, { x2, y2 });

    const pinchCurrentTouchPointDist = PinchToZoom.calculateDistance({ x1, y1 }, { x2, y2 });

    // delta > 0: enlarge(zoon in), delta < 0: diminish(zoom out)
    const deltaTouchPointDist = pinchCurrentTouchPointDist - this.pinchStartTouchPointDist;

    // update zoom factor
    const newZoomFactor = this.pinchStartZoomFactor + (deltaTouchPointDist * 0.01);
    this.zoomContentArea(newZoomFactor);
  }

  onPinchEnd(syntheticEvent) {
    syntheticEvent.preventDefault();
    this.guardZoomAreaScale();
    this.guardZoomAreaTranslate();
  }

  /*
    Pan event handlers
  */
  onPanStart(syntheticEvent) {
    // console.log('[PinchToZoom:onPanStart]');
    /*
      don't need to set e.preventDefault() here
      for one: this clause doesn't cause any visual effect
      for two: to preserve child element's ability to receive touch event
     */
    // syntheticEvent.preventDefault();
    const [x, y] = PinchToZoom.getTouchesCoordinate(syntheticEvent);
    this.panStartPoint = { x, y };

    const { currentTranslate } = this.getTransform();

    this.panStartTranslate = currentTranslate;
  }

  onPanMove(syntheticEvent) {
    syntheticEvent.preventDefault();
    const { currentZoomFactor } = this.getTransform();
    const [touchX, touchY] = PinchToZoom.getTouchesCoordinate(syntheticEvent);
    const deltaX = (touchX - this.panStartPoint.x) / currentZoomFactor;
    const deltaY = (touchY - this.panStartPoint.y) / currentZoomFactor;
    const newTranslateX = deltaX + this.panStartTranslate.x;
    const newTranslateY = deltaY + this.panStartTranslate.y;
    this.panContentArea(newTranslateX, newTranslateY);
    // console.log('[PinchToZoom:on pan move]', newTranslateX, newTranslateY);
  }

  onPanEnd() {
    // console.log('[PinchToZoom:onPanEnd]');
    /*
      don't need to set e.preventDefault() here
      for one: this clause doesn't cause any visual effect
      for two: to preserve child element's ability to receive touch event
     */
    // syntheticEvent.preventDefault();
    this.guardZoomAreaTranslate();
  }

  /* validate zoom factor value */
  guardZoomAreaScale() {
    const { currentZoomFactor } = this.getTransform();
    let newZoomFactor = currentZoomFactor;

    if (currentZoomFactor > this.props.maxZoomScale) {
      newZoomFactor = this.props.maxZoomScale;
    } else if (currentZoomFactor < this.props.minZoomScale) {
      newZoomFactor = this.props.minZoomScale;
    }

    if (newZoomFactor !== currentZoomFactor) {
      this.zoomContentArea(newZoomFactor);
    }
  }

  /* validate translate value */
  guardZoomAreaTranslate() {
    const { currentZoomFactor, currentTranslate } = this.getTransform();
    // if (currentZoomFactor < this.props.minZoomScale) { return; }

    // full screen width container size
    const { boundSize } = this.props;
    const containerW = boundSize.width; // this.zoomAreaContainer.clientWidth;
    const containerH = boundSize.height;  // this.zoomAreaContainer.clientHeight;
    // const containerRectRatio = containerW / containerH;

    // inner zoom area size
    // this.props.contentSize.width; // must use contentSize for webkit on iOS 9
    const w = this.zoomArea.clientWidth;
     //his.props.contentSize.height + 32 + 32 + 23;
    const h = this.zoomArea.clientHeight;
    // const zoomAreaRatio = w / h;

    //
    const adjustedTranslate = { x: currentTranslate.x, y: currentTranslate.y };

    const screenW = w * currentZoomFactor;
    const screenH = h * currentZoomFactor;

    const maxPositiveX = (containerW - screenW) / (2 * currentZoomFactor);
    const maxPositiveY = (containerH - screenH) / (2 * currentZoomFactor);
    // console.log('maxPositiveY: ', `${containerH} - ${screenH} / (2 * ${currentZoomFactor})`);
    const maxPositiveTranslate = {
      x: maxPositiveX > 0 ? Math.trunc(maxPositiveX * 10000) / 10000 : 0,
      y: maxPositiveY > 0 ? Math.trunc(maxPositiveY * 10000) / 10000 : 0,
    };

    // console.log('[PinchToZoom] maxPositiveTranslate: { x: %s, y: %s } ', maxPositiveTranslate.x, maxPositiveTranslate.y);

    if (currentTranslate.x > maxPositiveTranslate.x) {
      adjustedTranslate.x = maxPositiveTranslate.x;
    }

    if (currentTranslate.y > maxPositiveTranslate.y) {
      adjustedTranslate.y = maxPositiveTranslate.y;
    }

    const maxNegativeX = Math.min(
      (containerW - screenW) / currentZoomFactor,
      maxPositiveTranslate.x
    );
    const maxNegativeY = Math.min(
      (containerH - screenH) / currentZoomFactor,
      maxPositiveTranslate.y
    );
    const maxNegativeTranslate = {
      x: Math.trunc(maxNegativeX * 10000) / 10000,
      y: Math.trunc(maxNegativeY * 10000) / 10000,
    };

    // console.log('[PinchToZoom] maxNegativeTranslate: { x: %s, y: %s } ', maxNegativeTranslate.x, maxNegativeTranslate.y);

    // console.log('[guardZoomAreaTranslate] ', ` ${maxNegativeTranslate.x} = (${containerW} - (${w} * ${currentZoomFactor})) / ${currentZoomFactor}`);

    if (currentTranslate.x < maxNegativeTranslate.x) {
      adjustedTranslate.x = maxNegativeTranslate.x;
    }

    if (currentTranslate.y < maxNegativeTranslate.y) {
      adjustedTranslate.y = maxNegativeTranslate.y;
    }

    if (adjustedTranslate.x !== currentTranslate.x
        || adjustedTranslate.y !== currentTranslate.y) {
      this.panContentArea(adjustedTranslate.x, adjustedTranslate.y);
    }
  }

  /* perform pan transfrom */
  panContentArea(translateX, translateY) {
    // console.log('[panContentArea@PinchToZoom] { x: %s, y: %s }', translateX, translateY);
    this.setTransform({
      translate: {
        x: translateX,
        y: translateY,
      },
    });
  }

  /* perform zooming transfrom */
  zoomContentArea(zoomFactor) {
    // calculate delta translate needed
    const w = this.zoomAreaContainer.clientWidth;
    const h = this.zoomAreaContainer.clientHeight;

    const centerOriginal = {
      x: (w * this.pinchStartZoomFactor) / 2,
      y: (h * this.pinchStartZoomFactor) / 2,
    };

    const centerScale = {
      x: (w * zoomFactor) / 2,
      y: (h * zoomFactor) / 2,
    };

    const deltaTranslate = {
      x: (centerOriginal.x - centerScale.x) / (zoomFactor * this.pinchStartZoomFactor),
      y: (centerOriginal.y - centerScale.y) / (zoomFactor * this.pinchStartZoomFactor),
    };

    const originalTranslate = this.pinchStartTranslate;

    const targetTranslate = {
      x: deltaTranslate.x + originalTranslate.x,
      y: deltaTranslate.y + originalTranslate.y,
    };

    // update zoom scale and corresponding translate
    this.setTransform({
      zoomFactor: Math.trunc(zoomFactor * 10000) / 10000,
      translate: {
        x: targetTranslate.x,
        y: targetTranslate.y,
      },
    });
  }

  /*
    event handlers
  */

  handleTouchStart(syntheticEvent) {
    // console.log('[touch start]');
    this.zoomArea.style.transitionDuration = '0.0s';
    // 2 touches == pinch, else all considered as pan
    switch (syntheticEvent.nativeEvent.touches.length) {
      case 2:
        this.currentGesture = 'pinch';
        this.onPinchStart(syntheticEvent);
        break;
      default: {
        /* don't allow pan if zoom factor === minZoomScale */
        const { currentZoomFactor } = this.getTransform();
        const [x, y] = PinchToZoom.getTouchesCoordinate(syntheticEvent);
        this.setState({ lastSingleTouchPoint: { x, y } });
        if (currentZoomFactor === this.props.minZoomScale) {
          return true;
        }
        /*
          if we don't set `this.currentGesture = 'pan' `
          handleTouchMove won't trigger `this.onPanMove`
         */
        this.currentGesture = 'pan';
        this.onPanStart(syntheticEvent);
      }
    }
  }

  handleTouchMove(syntheticEvent) {
    // 2 touches == pinch, else all considered as pan
    switch (syntheticEvent.nativeEvent.touches.length) {
      case 2:
        if (this.currentGesture === 'pinch') {
          this.onPinchMove(syntheticEvent);
        }
        break;
      default:
        if (this.currentGesture === 'pan') {
          this.onPanMove(syntheticEvent);
        }
    }
  }

  handleTouchEnd(syntheticEvent) {
    // console.log('[touch end]');
    this.zoomArea.style.transitionDuration = '0.3s';
    if (this.currentGesture === 'pinch') {
      this.onPinchEnd(syntheticEvent);
    }
    if (this.currentGesture === 'pan') {
      this.onPanEnd(syntheticEvent);
    }
    this.currentGesture = 'unknown';
  }

  autoZoomToLastTouchPoint() {
    const { lastSingleTouchPoint } = this.state;
    console.log('[autoZoomToLastTouchPoint] lastSingleTouchPoint: ', lastSingleTouchPoint);
    if (lastSingleTouchPoint.x === 0 && lastSingleTouchPoint.y === 0) return;
    this.autoZoomToPosition(lastSingleTouchPoint);
  }

  // auto zoom
  autoZoomToPosition({ x, y }) {
    console.log('[autoZoomToPosition] autoZoomToPosition: ', x, y);
    const autoZoomFactor = 2.0;
    const { currentZoomFactor, currentTranslate } = this.getTransform();
    // const zoomAreaW = this.zoomArea.clientWidth;
    // const zoomAreaH = this.zoomArea.clientHeight;
    const zoomAreaContainerW = this.zoomAreaContainer.clientWidth;
    const zoomAreaContainerH = this.zoomAreaContainer.clientHeight;

    // calculate target points with respect to the zoomArea coordinate
    // & adjust to current zoomFactor + existing translate
    const zoomAreaX = ((x / currentZoomFactor) - currentTranslate.x) * autoZoomFactor;
    const zoomAreaY = ((y / currentZoomFactor) - currentTranslate.y) * autoZoomFactor;

    // calculate distance to translate the target points to zoomAreaContainer's center
    const deltaX = (zoomAreaContainerW / 2) - zoomAreaX;
    const deltaY = (zoomAreaContainerH / 2) - zoomAreaY;

    // adjust to the new zoomFactor
    const inScaleTranslate = {
      x: deltaX / autoZoomFactor,
      y: deltaY / autoZoomFactor,
    };
    // console.log('[autoZoomToPosition] move touch point to center: ', inScaleTranslate);
    // this.panContentArea(targetTranslate.x, targetTranslate.y);

    // update zoom scale and corresponding translate
    // console.log('[autoZoomToPosition] set transformOrigin: ', zoomAreaX, zoomAreaY);
    // this.zoomArea.style.transformOrigin = `${zoomAreaX}px ${zoomAreaY}px 0px`;
    this.zoomArea.style.transitionDuration = '0.3s';
    this.setTransform({
      zoomFactor: autoZoomFactor,
      translate: {
        x: inScaleTranslate.x,
        y: inScaleTranslate.y,
      },
    });
    this.guardZoomAreaTranslate();
  }

  /*
    update zoom area transform
  */
  setTransform({
    zoomFactor = this.transform.zoomFactor,
    translate = { x: this.transform.translate.x, y: this.transform.translate.y },
  } = {}) {
    const roundTransalteX = Math.round(translate.x * 1000) / 1000;
    const roundTransalteY = Math.round(translate.y * 1000) / 1000;

    // don't allow zoomFactor smaller then this.props.minZoomScale * 0.8
    if (zoomFactor < this.props.minZoomScale * 0.8) return;

    // update the lastest transform value
    this.transform.zoomFactor = zoomFactor;
    this.transform.translate.x = roundTransalteX;
    this.transform.translate.y = roundTransalteY;
    // console.log('[setTransform] ', this.transform);

    // update the transform style
    const styleString = `
        scale(${zoomFactor})
        translate(${roundTransalteX}px, ${roundTransalteY}px)
        translateZ(${0})
      `;

    this.zoomArea.style.transform = styleString;
    this.zoomArea.style.webkitTransform = styleString;
  }

  /*
    get a *copy* of current zoom area transformation value
  */
  getTransform() {
    return {
      currentZoomFactor: this.transform.zoomFactor,
      currentTranslate: {
        x: this.transform.translate.x,
        y: this.transform.translate.y,
      },
    };
  }

  /*
    React render
  */

  render() {
    const { children, boundSize, contentSize } = this.props;

    const inlineStyle = {
      minWidth: `${boundSize.width}px`,
      height: `${boundSize.height}px`,
      maxHeight: `${boundSize.height}px`,
    };

    return (
      <div
        className="pinch-to-zoom-container"
        style={inlineStyle}
        onTouchStart={e => this.handleTouchStart(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onTouchEnd={e => this.handleTouchEnd(e)}
        ref={(c) => { this.zoomAreaContainer = c; }}
      >
        <div
          className="pinch-to-zoom-area"
          ref={(c) => { this.zoomArea = c; }}
          style={{ minWidth: contentSize.width, minHeight: contentSize.height }}
        >
          { children }
        </div>
      </div>
    );
  }
}

PinchToZoom.defaultProps = {
  minZoomScale: 1.0,
  maxZoomScale: 4.0,
  boundSize: {
    width: 100,
    height: 100,
  },
  contentSize: {
    width: 100,
    height: 100,
  },
};

PinchToZoom.propTypes = {
  minZoomScale: PropTypes.number,
  maxZoomScale: PropTypes.number,
  boundSize: PropTypes.shape({
    // bound size is the out touch area size
    // the width should match device's width e.g. 320 for iphone 5
    width: PropTypes.number, // eslint-disable-line
    height: PropTypes.number, // eslint-disable-line
  }),
  contentSize: PropTypes.shape({
    // content size is the inner content initial size
    // the width should match the inner content element's width when scale is 1
    width: PropTypes.number, // eslint-disable-line
    height: PropTypes.number, // eslint-disable-line
  }),
  children: PropTypes.node,
};

export default PinchToZoom;
