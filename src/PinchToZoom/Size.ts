import { Point } from './Point'
interface Size {
  width: number
  height: number
}

function map(k: Size, f: (n: number) => number): Size {
  return {
    width: f(k.width),
    height: f(k.height),
  }
}

function scale(k: Size, s: number): Size {
  return map(k, v => v * s)
}

function diff(m: Size, n: Size): Size {
  return {
    width: m.width - n.width,
    height: m.height - n.height,
  }
}

function isEqual(m: Size, n: Size): boolean {
  return m.width === n.width && m.height === n.height
}

function toPoint(s: Size): Point {
  return {
    x: s.width,
    y: s.height
  }
}

export { Size, scale, diff, isEqual, toPoint }
