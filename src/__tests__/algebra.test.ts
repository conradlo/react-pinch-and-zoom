import { distance, midpoint, normalizePointInRect } from '../PinchToZoom/algebra'

test('test distance', () => {
  const testcases = [{
    input: [{ x: 3, y: 0 }, { x: 0, y: 4 }],
    expected: 5
  }]

  for (const t of testcases) {
    const {input: [p1, p2], expected } = t
    expect(distance(p1, p2)).toBe(expected);
  }
});

