import { Rect } from './Rect'
import { Size } from './Size'

interface Point {
  x: number
  y: number
}

function distance(p1: Point, p2: Point): number {
  // Pythagorean Theorem: c^2 = a^2 + b^2
  const { x: x1, y: y1 } = p1
  const { x: x2, y: y2 } = p2
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function midpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

function offset(p: Point, origin: Point): Point {
  return {
    x: p.x - origin.x,
    y: p.y - origin.y,
  }
}

function map(p: Point, f: (n: number) => number): Point {
  return {
    x: f(p.x),
    y: f(p.y),
  }
}

function scale(p: Point, s: number): Point {
  return map(p, v => v * s)
}

function sum(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  }
}

function isEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y
}

function boundWithin(min: Point, current: Point, max: Point): Point {
  const numberWithin = (lower: number, num: number, upper: number) => {
    return num > upper ? upper : lower > num ? lower : num
  }
  return {
    x: numberWithin(min.x, current.x, max.x),
    y: numberWithin(min.y, current.y, max.y),
  }
}

function normalizePointInRect(point: Point, rect: Rect) {
  return {
    x: point.x - rect.origin.x,
    y: point.y - rect.origin.y,
  }
}

function toSize(p: Point): Size {
  return {
    width: p.x,
    height: p.y
  }
}

export {
  Point,
  distance,
  midpoint,
  offset,
  sum,
  map,
  scale,
  isEqual,
  boundWithin,
  toSize,
  normalizePointInRect,
}
