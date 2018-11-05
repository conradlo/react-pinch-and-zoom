
interface Point {
  x: number;
  y: number;
}

function distance(p1: Point, p2: Point): number {
  // Pythagorean Theorem: c^2 = a^2 + b^2
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function midpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export {
  distance,
  midpoint
}