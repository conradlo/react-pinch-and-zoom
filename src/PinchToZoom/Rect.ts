import { Point } from './Point'

interface Size {
  width: number,
  height: number
}

interface Rect {
  origin: Point,
  size: Size
}

export {
  Rect
}