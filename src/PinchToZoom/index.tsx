/**
 * PinchToZoom react componenets
 */

import * as PropTypes from 'prop-types'
import * as React from 'react'
import * as Point from './Point'
import * as Size from './Size'

const truncRound = (num: number): number => Math.trunc(num * 10000) / 10000

enum GUESTURE_TYPE {
  UNSET = 'GUESTURE_TYPE_UNSET',
  PAN = 'GUESTURE_TYPE_PAN',
  PINCH = 'GUESTURE_TYPE_PINCH',
}

interface PinchToZoomProps {
  debug: boolean
  className: string
  minZoomScale: number
  maxZoomScale: number
  boundSize: Size.Size
  contentSize: Size.Size
  fillContainer?: boolean

  /** Callback to run each time transform is updated */
  onTransform?: (
    transform: {
      zoomFactor: number
      translate: Point.Point
    }
  ) => void
}

interface PinchToZoomState {
  lastSingleTouchPoint: Point.Point
}

class PinchToZoom extends React.Component<PinchToZoomProps, PinchToZoomState> {
  public static defaultProps: {}
  public static propTypes: {}
  public static getTouchesCoordinate(
    syntheticEvent: React.SyntheticEvent
  ): Point.Point[] {
    /**
     * adjust browser touch point coordinate to bounds
     */
    const {
      currentTarget: { parentNode },
      nativeEvent,
    } = syntheticEvent
    // DOM node
    if (
      !(parentNode instanceof HTMLElement) ||
      !(nativeEvent instanceof TouchEvent)
    ) {
      return []
    }
    const containerRect = parentNode.getBoundingClientRect()
    const rect = {
      origin: { x: containerRect.left, y: containerRect.top },
      size: {
        width: containerRect.width,
        height: containerRect.height,
      },
    }
    // DOM touch list
    const { touches: touchList } = nativeEvent
    const coordinates = [] // [{x1, y1}, {x2, y2}...]
    for (let i = 0; i < touchList.length; i += 1) {
      const touch = touchList.item(i)
      if (touch) {
        const touchPoint = {
          x: touch.clientX,
          y: touch.clientY,
        }
        const p = Point.normalizePointInRect(touchPoint, rect)
        coordinates.push(p)
      }
    }
    return coordinates
  }

  public transform: {
    zoomFactor: number
    translate: Point.Point
  }

  public currentGesture: GUESTURE_TYPE

  public pinchStartZoomFactor: number
  public pinchStartTouchMidpoint: Point.Point
  public pinchStartTranslate: Point.Point
  public pinchStartTouchPointDist: number

  public panStartPoint: Point.Point
  public panStartTranslate: Point.Point

  public zoomAreaContainer?: HTMLDivElement
  public zoomArea?: HTMLDivElement

  constructor(props: PinchToZoomProps) {
    super(props)

    // instance variable: transform data
    this.transform = {
      zoomFactor: 1.0,
      translate: Point.newOriginPoint(),
    }

    // instance variable: guesture
    this.currentGesture = GUESTURE_TYPE.UNSET

    // instance variable: pinch
    this.pinchStartZoomFactor = 1.0
    this.pinchStartTouchMidpoint = Point.newOriginPoint()
    this.pinchStartTranslate = Point.newOriginPoint()
    this.pinchStartTouchPointDist = 0

    // instance variable: pan
    this.panStartPoint = Point.newOriginPoint()
    this.panStartTranslate = Point.newOriginPoint()

    // record last touch point
    this.state = {
      lastSingleTouchPoint: Point.newOriginPoint(),
    }
  }

  public componentDidUpdate(prevProps: PinchToZoomProps) {
    if (
      prevProps.minZoomScale !== this.props.minZoomScale ||
      prevProps.boundSize.height !== this.props.boundSize.height
    ) {
      this.zoomContentArea(this.props.minZoomScale)
      this.guardZoomAreaTranslate()
    }
  }

  public componentDidMount(): void {
    setTimeout(() => {
      const startEvent = new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
      })
      const endEvent = new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
      })
      if (this.zoomAreaContainer) {
        this.zoomAreaContainer.dispatchEvent(startEvent)
        this.zoomAreaContainer.dispatchEvent(endEvent)
      }
    }, 0)
  }

  /*
    Pinch event handlers
  */

  public onPinchStart(syntheticEvent: React.SyntheticEvent) {
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

  public onPinchMove(syntheticEvent: React.SyntheticEvent) {
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

  public onPinchEnd() {
    this.guardZoomAreaScale()
    this.guardZoomAreaTranslate()
  }

  /*
    Pan event handlers
  */
  public onPanStart(syntheticEvent: React.SyntheticEvent) {
    const [p1] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
    const { currentTranslate } = this.getTransform()

    this.panStartPoint = p1
    this.panStartTranslate = currentTranslate
  }

  public onPanMove(syntheticEvent: React.SyntheticEvent) {
    const [dragPoint] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
    const { currentZoomFactor } = this.getTransform()
    const origin = this.panStartPoint
    const prevTranslate = this.panStartTranslate

    const dragOffset = Point.offset(dragPoint, origin)
    const adjustedZoomOffset = Point.scale(dragOffset, 1 / currentZoomFactor)
    const nextTranslate = Point.sum(adjustedZoomOffset, prevTranslate)
    this.panContentArea(nextTranslate)
  }

  public onPanEnd() {
    this.guardZoomAreaTranslate()
  }

  /* validate zoom factor value */
  public guardZoomAreaScale() {
    const { currentZoomFactor } = this.getTransform()
    const { minZoomScale, maxZoomScale } = this.props
    if (currentZoomFactor > maxZoomScale) {
      this.zoomContentArea(maxZoomScale)
    } else if (currentZoomFactor < minZoomScale) {
      this.zoomContentArea(minZoomScale)
    }
  }

  /* validate translate value */
  public guardZoomAreaTranslate() {
    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    const { currentZoomFactor, currentTranslate } = this.getTransform()
    const { minZoomScale } = this.props
    const {
      clientWidth: containerW,
      clientHeight: containerH,
    } = this.zoomAreaContainer
    const { clientWidth: contentW, clientHeight: contentH } = this.zoomArea
    if (currentZoomFactor < minZoomScale) {
      return
    }

    // container size
    const boundSize = {
      width: containerW,
      height: containerH,
    }

    // content size adjusted to zoom factor
    const contentSize = Size.scale(
      {
        width: contentW,
        height: contentH,
      },
      currentZoomFactor
    )

    const diff = Size.diff(boundSize, contentSize)
    const diffInPoint = Size.toPoint(diff)

    const unitScaleLeftTopPoint = Point.scale(
      diffInPoint,
      1 / (2 * currentZoomFactor)
    )

    const maxLeftTopPoint = Point.boundWithin(
      Point.newOriginPoint(),
      unitScaleLeftTopPoint,
      Point.map(unitScaleLeftTopPoint, truncRound)
    )

    const unitScaleRightBottomPoint = Point.scale(
      diffInPoint,
      1 / currentZoomFactor
    )

    const maxRightBottomPoint = {
      x: Math.min(unitScaleRightBottomPoint.x, maxLeftTopPoint.x),
      y: Math.min(unitScaleRightBottomPoint.y, maxLeftTopPoint.y),
    }

    const validatePos = Point.boundWithin(
      maxRightBottomPoint,
      currentTranslate,
      maxLeftTopPoint
    )

    if (!Point.isEqual(validatePos, currentTranslate)) {
      this.panContentArea(validatePos)
    }
  }

  /* perform pan transfrom */
  public panContentArea(pos: Point.Point) {
    this.setTransform({
      translate: pos,
    })
  }

  /* perform zooming transfrom */
  public zoomContentArea(zoomFactor: number) {
    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    // calculate delta translate needed
    const prevZoomFactor = this.pinchStartZoomFactor
    const prevTranslate = this.pinchStartTranslate
    const {
      clientWidth: containerW,
      clientHeight: containerH,
    } = this.zoomAreaContainer

    const boundSize = {
      width: containerW,
      height: containerH,
    }

    const prevZoomSize = Size.scale(boundSize, prevZoomFactor)
    const nextZoomSize = Size.scale(boundSize, zoomFactor)

    const prevRectCenterPoint = {
      x: prevZoomSize.width / 2,
      y: prevZoomSize.height / 2,
    }

    const nextRectCenterPoint = {
      x: nextZoomSize.width / 2,
      y: nextZoomSize.height / 2,
    }

    const deltaTranslate = Point.scale(
      Point.offset(prevRectCenterPoint, nextRectCenterPoint),
      1 / (zoomFactor * prevZoomFactor)
    )

    const accumulateTranslate = Point.sum(deltaTranslate, prevTranslate)

    // update zoom scale and corresponding translate
    this.setTransform({
      zoomFactor: truncRound(zoomFactor),
      translate: accumulateTranslate,
    })
  }

  /*
    event handlers
  */

  public handleTouchStart(syntheticEvent: React.SyntheticEvent) {
    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    const { nativeEvent } = syntheticEvent
    if (!(nativeEvent instanceof TouchEvent)) {
      return
    }
    this.zoomArea.style.transitionDuration = '0.0s'
    // 2 touches == pinch, else all considered as pan
    switch (nativeEvent.touches.length) {
      case 2:
        this.currentGesture = GUESTURE_TYPE.PINCH
        this.onPinchStart(syntheticEvent)
        break
      default: {
        /* don't allow pan if zoom factor === minZoomScale */
        const [p1] = PinchToZoom.getTouchesCoordinate(syntheticEvent)
        this.setState({ lastSingleTouchPoint: p1 })
        this.currentGesture = GUESTURE_TYPE.PAN
        this.onPanStart(syntheticEvent)
      }
    }
  }

  public handleTouchMove(syntheticEvent: React.SyntheticEvent) {
    // 2 touches == pinch, else all considered as pan
    const { nativeEvent } = syntheticEvent
    if (!(nativeEvent instanceof TouchEvent)) {
      return
    }
    switch (nativeEvent.touches.length) {
      case 2:
        if (this.currentGesture === GUESTURE_TYPE.PINCH) {
          this.onPinchMove(syntheticEvent)
        }
        break
      default:
        if (this.currentGesture === GUESTURE_TYPE.PAN) {
          this.onPanMove(syntheticEvent)
        }
    }
  }

  public handleTouchEnd(syntheticEvent: React.SyntheticEvent) {
    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    this.zoomArea.style.transitionDuration = '0.3s'
    if (this.currentGesture === GUESTURE_TYPE.PINCH) {
      this.onPinchEnd()
    }
    if (this.currentGesture === GUESTURE_TYPE.PAN) {
      this.onPanEnd()
    }
    this.currentGesture = GUESTURE_TYPE.UNSET
  }

  public autoZoomToLastTouchPoint() {
    const { lastSingleTouchPoint } = this.state
    if (lastSingleTouchPoint.x === 0 && lastSingleTouchPoint.y === 0) {
      return
    }
    this.autoZoomToPosition(lastSingleTouchPoint)
  }

  // auto zoom
  public autoZoomToPosition(pos: Point.Point) {
    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    const autoZoomFactor = 2.0
    const { currentZoomFactor, currentTranslate } = this.getTransform()
    const zoomAreaContainerW = this.zoomAreaContainer.clientWidth
    const zoomAreaContainerH = this.zoomAreaContainer.clientHeight

    // calculate target points with respect to the zoomArea coordinate
    // & adjust to current zoomFactor + existing translate
    const zoomAreaX =
      (pos.x / currentZoomFactor - currentTranslate.x) * autoZoomFactor
    const zoomAreaY =
      (pos.y / currentZoomFactor - currentTranslate.y) * autoZoomFactor

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
  public setTransform({
    zoomFactor = this.transform.zoomFactor,
    translate = {
      x: this.transform.translate.x,
      y: this.transform.translate.y,
    },
  } = {}) {
    const { onTransform, minZoomScale } = this.props

    if (!this.zoomAreaContainer || !this.zoomArea) {
      return
    }
    const roundTransalteX = Math.round(translate.x * 1000) / 1000
    const roundTransalteY = Math.round(translate.y * 1000) / 1000

    // don't allow zoomFactor smaller then this.props.minZoomScale * 0.8
    if (zoomFactor < minZoomScale * 0.8) {
      return
    }

    // update the lastest transform value
    this.transform.zoomFactor = zoomFactor
    this.transform.translate.x = roundTransalteX
    this.transform.translate.y = roundTransalteY

    // run optional onTransform callback
    if (onTransform) {
      onTransform(this.transform)
    }

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
  public getTransform() {
    const { zoomFactor, translate } = this.transform
    return {
      currentZoomFactor: zoomFactor,
      currentTranslate: {
        x: translate.x,
        y: translate.y,
      },
    }
  }

  /*
    React render
  */

  public render() {
    const { debug, fillContainer, className, children } = this.props

    const classNameList = ['', 'pinch-to-zoom-container']

    const containerInlineStyle = {
      display: 'inline-block',
      overflow: 'hidden',
      backgroundColor: 'inherit',
      width: fillContainer ? '100%' : undefined,
      height: fillContainer ? '100%' : undefined,
    }

    const zoomAreaInlineStyle = {
      display: 'inline-block',
      willChange: 'transform',
      transformOrigin: '0px 0px 0px',
      transition: 'transform 0ms ease',
      transitionTimingFunction: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
      transitionDuration: '0ms',
      perspective: 1000,
      width: '100%', // match `pinch-to-zoom-container` width
    }

    if (debug) {
      classNameList.push('debug')
      containerInlineStyle.backgroundColor = 'red'
    }

    return (
      <div
        className={className.concat(classNameList.join(' '))}
        style={containerInlineStyle}
        onTouchStart={e => this.handleTouchStart(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onTouchEnd={e => this.handleTouchEnd(e)}
        ref={c => {
          this.zoomAreaContainer = c || undefined
        }}
      >
        <div
          className="pinch-to-zoom-area"
          style={zoomAreaInlineStyle}
          ref={c => {
            this.zoomArea = c || undefined
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
  fillContainer: false,
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
  fillContainer: PropTypes.bool,
  children: PropTypes.node,
}

export default PinchToZoom
