/**
 * PinchToZoom react componenets
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Point from './Point.ts'

class PinchToZoom extends Component {
  static getTouchesCoordinate(syntheticEvent) {
    /**
     * adjust browser touch point coordinate to bounds
     */
    const { currentTarget, nativeEvent } = syntheticEvent
    // DOM node
    const containerRect = currentTarget.parentNode.getBoundingClientRect()
    const rect = {
      origin: { x: containerRect.left, y: containerRect.top },
      size: {
        width: containerRect.width,
        height: containerRect.height,
      },
    }
    // DOM touch list
    const touchList = nativeEvent.touches
    const coordinates = [] // [{x1, y1}, {x2, y2}...]
    for (let i = 0; i < touchList.length; i += 1) {
      const touch = touchList.item(i)
      const touchPoint = {
        x: touch.clientX,
        y: touch.clientY,
      }
      const p = Point.normalizePointInRect(touchPoint, rect)
      coordinates.push(p)
    }
    return coordinates
  }

  constructor(props) {
    super(props)

    // instance variable: transform data
    this.transform = {}
    this.transform.zoomFactor = 1.0
    this.transform.translate = {
      x: 0.0,
      y: 0.0,
    }

    // instance variable: guesture
    this.currentGesture = 'unknown' // 'pinch', 'pan', 'unknown'

    // instance variable: pinch
    this.pinchStartZoomFactor = 1.0
    this.pinchStartTouchMidpoint = { x: 0, y: 0 }
    this.pinchStartTranslate = { x: 0, y: 0 }
    this.pinchStartTouchPointDist = 0

    // instance variable: pan
    this.panStartPoint = { x: 0, y: 0 }
    this.panStartTranslate = { x: 0, y: 0 }

    // record last touch point
    this.state = {
      lastSingleTouchPoint: { x: 0, y: 0 },
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (
      prevProps.minZoomScale !== this.props.minZoomScale ||
      prevProps.boundSize.height !== this.props.boundSize.height
    ) {
      this.zoomContentArea(this.props.minZoomScale)
      this.guardZoomAreaTranslate()
    }
  }
  /*
    Pinch event handlers
  */

  onPinchStart(syntheticEvent) {
    const [p1, p2] = PinchToZoom.getTouchesCoordinate(syntheticEvent)

    // on pinch start remember the mid point of 2 touch points
    this.pinchStartTouchMidpoint = Point.midpoint(p1, p2)

    // on pinch start remember the distance of 2 touch points
    this.pinchStartTouchPointDist = Point.distance(p1, p2)

    /*
      on pinch start, remember the `origianl zoom factor`
      & `origianl plan translate` before pinching
    */
    const { currentZoomFactor, currentTranslate } = this.getTransform()
    this.pinchStartZoomFactor = currentZoomFactor
    this.pinchStartTranslate = currentTranslate
  }

  onPinchMove(syntheticEvent) {
    // get lastest touch point coordinate
    const [p1, p2] = PinchToZoom.getTouchesCoordinate(syntheticEvent)

    // const pinchCurrentTouchMidpoint = SeatingPlan.calculateMidpoint({ x1, y1 }, { x2, y2 });

    const pinchCurrentTouchPointDist = Point.distance(p1, p2)

    // delta > 0: enlarge(zoon in), delta < 0: diminish(zoom out)
    const deltaTouchPointDist =
      pinchCurrentTouchPointDist - this.pinchStartTouchPointDist

    // update zoom factor
    const newZoomFactor = this.pinchStartZoomFactor + deltaTouchPointDist * 0.01
    this.zoomContentArea(newZoomFactor)
  }

  onPinchEnd() {
    this.guardZoomAreaScale()
    this.guardZoomAreaTranslate()
  }

  /*
    Pan event handlers
  */
  onPanStart(syntheticEvent) {
    const [p1] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
    const { currentTranslate } = this.getTransform()

    this.panStartPoint = p1
    this.panStartTranslate = currentTranslate
  }

  onPanMove(syntheticEvent) {
    const [dragPoint] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
    const { currentZoomFactor } = this.getTransform()
    const origin = this.panStartPoint
    const prevTranslate = this.panStartTranslate

    const dragOffset = Point.offset(dragPoint, origin)
    const adjustedZoomOffset = Point.map(dragOffset, v => v / currentZoomFactor)
    const nextTranslate = Point.sum(adjustedZoomOffset, prevTranslate)
    this.panContentArea(nextTranslate)
  }

  onPanEnd() {
    this.guardZoomAreaTranslate()
  }

  /* validate zoom factor value */
  guardZoomAreaScale() {
    const { currentZoomFactor } = this.getTransform()
    const { minZoomScale, maxZoomScale } = this.props
    if (currentZoomFactor > maxZoomScale) {
      this.zoomContentArea(maxZoomScale)
    } else if (currentZoomFactor < minZoomScale) {
      this.zoomContentArea(minZoomScale)
    }
  }

  /* validate translate value */
  guardZoomAreaTranslate() {
    const { currentZoomFactor, currentTranslate } = this.getTransform()
    const { minZoomScale } = this.props
    if (currentZoomFactor < minZoomScale) {
      return
    }

    // container size
    const {
      clientWidth: containerW,
      clientHeight: containerH,
    } = this.zoomAreaContainer

    // zoom area size
    const { clientWidth: w, clientHeight: h } = this.zoomArea

    //
    const { x: old_x, y: old_y } = currentTranslate
    const adjustedTranslate = { x: old_x, y: old_y }

    const screenW = w * currentZoomFactor
    const screenH = h * currentZoomFactor

    const maxPositiveX = (containerW - screenW) / (2 * currentZoomFactor)
    const maxPositiveY = (containerH - screenH) / (2 * currentZoomFactor)
    const maxPositiveTranslate = {
      x: maxPositiveX > 0 ? Math.trunc(maxPositiveX * 10000) / 10000 : 0,
      y: maxPositiveY > 0 ? Math.trunc(maxPositiveY * 10000) / 10000 : 0,
    }

    if (currentTranslate.x > maxPositiveTranslate.x) {
      adjustedTranslate.x = maxPositiveTranslate.x
    }

    if (currentTranslate.y > maxPositiveTranslate.y) {
      adjustedTranslate.y = maxPositiveTranslate.y
    }

    const maxNegativeX = Math.min(
      (containerW - screenW) / currentZoomFactor,
      maxPositiveTranslate.x
    )
    const maxNegativeY = Math.min(
      (containerH - screenH) / currentZoomFactor,
      maxPositiveTranslate.y
    )
    const maxNegativeTranslate = {
      x: Math.trunc(maxNegativeX * 10000) / 10000,
      y: Math.trunc(maxNegativeY * 10000) / 10000,
    }

    if (currentTranslate.x < maxNegativeTranslate.x) {
      adjustedTranslate.x = maxNegativeTranslate.x
    }

    if (currentTranslate.y < maxNegativeTranslate.y) {
      adjustedTranslate.y = maxNegativeTranslate.y
    }

    if (
      adjustedTranslate.x !== currentTranslate.x ||
      adjustedTranslate.y !== currentTranslate.y
    ) {
      this.panContentArea(adjustedTranslate)
    }
  }

  /* perform pan transfrom */
  panContentArea({ x, y }) {
    this.setTransform({
      translate: {
        x,
        y,
      },
    })
  }

  /* perform zooming transfrom */
  zoomContentArea(zoomFactor) {
    // calculate delta translate needed
    const w = this.zoomAreaContainer.clientWidth
    const h = this.zoomAreaContainer.clientHeight

    const centerOriginal = {
      x: (w * this.pinchStartZoomFactor) / 2,
      y: (h * this.pinchStartZoomFactor) / 2,
    }

    const centerScale = {
      x: (w * zoomFactor) / 2,
      y: (h * zoomFactor) / 2,
    }

    const deltaTranslate = {
      x:
        (centerOriginal.x - centerScale.x) /
        (zoomFactor * this.pinchStartZoomFactor),
      y:
        (centerOriginal.y - centerScale.y) /
        (zoomFactor * this.pinchStartZoomFactor),
    }

    const originalTranslate = this.pinchStartTranslate

    const targetTranslate = {
      x: deltaTranslate.x + originalTranslate.x,
      y: deltaTranslate.y + originalTranslate.y,
    }

    // update zoom scale and corresponding translate
    this.setTransform({
      zoomFactor: Math.trunc(zoomFactor * 10000) / 10000,
      translate: {
        x: targetTranslate.x,
        y: targetTranslate.y,
      },
    })
  }

  /*
    event handlers
  */

  handleTouchStart(syntheticEvent) {
    this.zoomArea.style.transitionDuration = '0.0s'
    // 2 touches == pinch, else all considered as pan
    switch (syntheticEvent.nativeEvent.touches.length) {
      case 2:
        this.currentGesture = 'pinch'
        this.onPinchStart(syntheticEvent)
        break
      default: {
        /* don't allow pan if zoom factor === minZoomScale */
        const [p1] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
        this.setState({ lastSingleTouchPoint: p1 })
        /*
          if we don't set `this.currentGesture = 'pan' `
          handleTouchMove won't trigger `this.onPanMove`
         */
        this.currentGesture = 'pan'
        this.onPanStart(syntheticEvent)
      }
    }
  }

  handleTouchMove(syntheticEvent) {
    // 2 touches == pinch, else all considered as pan
    switch (syntheticEvent.nativeEvent.touches.length) {
      case 2:
        if (this.currentGesture === 'pinch') {
          this.onPinchMove(syntheticEvent)
        }
        break
      default:
        if (this.currentGesture === 'pan') {
          this.onPanMove(syntheticEvent)
        }
    }
  }

  handleTouchEnd(syntheticEvent) {
    this.zoomArea.style.transitionDuration = '0.3s'
    if (this.currentGesture === 'pinch') {
      this.onPinchEnd(syntheticEvent)
    }
    if (this.currentGesture === 'pan') {
      this.onPanEnd(syntheticEvent)
    }
    this.currentGesture = 'unknown'
  }

  autoZoomToLastTouchPoint() {
    const { lastSingleTouchPoint } = this.state
    if (lastSingleTouchPoint.x === 0 && lastSingleTouchPoint.y === 0) return
    this.autoZoomToPosition(lastSingleTouchPoint)
  }

  // auto zoom
  autoZoomToPosition({ x, y }) {
    const autoZoomFactor = 2.0
    const { currentZoomFactor, currentTranslate } = this.getTransform()
    const zoomAreaContainerW = this.zoomAreaContainer.clientWidth
    const zoomAreaContainerH = this.zoomAreaContainer.clientHeight

    // calculate target points with respect to the zoomArea coordinate
    // & adjust to current zoomFactor + existing translate
    const zoomAreaX =
      (x / currentZoomFactor - currentTranslate.x) * autoZoomFactor
    const zoomAreaY =
      (y / currentZoomFactor - currentTranslate.y) * autoZoomFactor

    // calculate distance to translate the target points to zoomAreaContainer's center
    const deltaX = zoomAreaContainerW / 2 - zoomAreaX
    const deltaY = zoomAreaContainerH / 2 - zoomAreaY

    // adjust to the new zoomFactor
    const inScaleTranslate = {
      x: deltaX / autoZoomFactor,
      y: deltaY / autoZoomFactor,
    }

    // update zoom scale and corresponding translate
    this.zoomArea.style.transitionDuration = '0.3s'
    this.setTransform({
      zoomFactor: autoZoomFactor,
      translate: {
        x: inScaleTranslate.x,
        y: inScaleTranslate.y,
      },
    })
    this.guardZoomAreaTranslate()
  }

  /*
    update zoom area transform
  */
  setTransform({
    zoomFactor = this.transform.zoomFactor,
    translate = {
      x: this.transform.translate.x,
      y: this.transform.translate.y,
    },
  } = {}) {
    const roundTransalteX = Math.round(translate.x * 1000) / 1000
    const roundTransalteY = Math.round(translate.y * 1000) / 1000

    // don't allow zoomFactor smaller then this.props.minZoomScale * 0.8
    if (zoomFactor < this.props.minZoomScale * 0.8) return

    // update the lastest transform value
    this.transform.zoomFactor = zoomFactor
    this.transform.translate.x = roundTransalteX
    this.transform.translate.y = roundTransalteY

    // update the transform style
    const styleString = `
        scale(${zoomFactor})
        translate(${roundTransalteX}px, ${roundTransalteY}px)
        translateZ(${0})
      `

    this.zoomArea.style.transform = styleString
    this.zoomArea.style.webkitTransform = styleString
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
    }
  }

  /*
    React render
  */

  render() {
    const { debug, className, children } = this.props

    const _className = ['', 'pinch-to-zoom-container']

    const container_inline_style = {
      display: 'inline-block',
      overflow: 'hidden',
    }

    const zoom_area_inline_style = {
      display: 'inline-block',
      willChange: 'transform',
      transformOrigin: '0px 0px 0px',
      transition: 'transform 0ms ease',
      transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
      transitionDuration: '0ms',
      backfaceVisibility: 'hidden',
      perspective: 1000,
      width: '100%', // match `pinch-to-zoom-container` width
    }

    if (debug) {
      _className.push('debug')
      container_inline_style.backgroundColor = 'red'
    }

    return (
      <div
        className={className.concat(_className.join(' '))}
        style={container_inline_style}
        onTouchStart={e => this.handleTouchStart(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onTouchEnd={e => this.handleTouchEnd(e)}
        ref={c => {
          this.zoomAreaContainer = c
        }}
      >
        <div
          className="pinch-to-zoom-area"
          style={zoom_area_inline_style}
          ref={c => {
            this.zoomArea = c
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}

PinchToZoom.defaultProps = {
  debug: false,
  className: '',
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
}

PinchToZoom.propTypes = {
  debug: PropTypes.bool,
  className: PropTypes.string,
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
}

export default PinchToZoom
