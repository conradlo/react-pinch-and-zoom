import {
  boundWithin,
  distance,
  midpoint,
} from '../PinchToZoom/Point'

test('test distance', () => {
  const testcases = [
    {
      input: [{ x: 3, y: 0 }, { x: 0, y: 4 }],
      expected: 5,
    },
    {
      input: [{ x: -3, y: 2 }, { x: 3, y: 5 }],
      expected: 3 * Math.sqrt(5),
    },
    {
      input: [{ x: -1, y: -1 }, { x: 4, y: -5 }],
      expected: Math.sqrt(41),
    },
  ]

  for (const t of testcases) {
    const {
      input: [p1, p2],
      expected,
    } = t
    expect(distance(p1, p2)).toEqual(expected)
  }
})

test('test midpoint', () => {
  const testcases = [
    {
      input: [{ x: 3, y: 0 }, { x: 0, y: 4 }],
      expected: { x: 1.5, y: 2 },
    }
  ]

  for (const t of testcases) {
    const {
      input: [p1, p2],
      expected,
    } = t
    expect(midpoint(p1, p2)).toEqual(expected)
  }
})

test('test boundWithin', () => {
  const testcases = [
    {
      input: [{ x: 0, y: 0 }, { x: 0, y: 0 }, {x: 0, y: 0}],
      expected: { x: 0, y: 0 },
    },
    {
      input: [{ x: 0, y: 0 }, { x: -10, y: -10 }, {x: 0, y: 0}],
      expected: { x: 0, y: 0 },
    },
    {
      input: [{ x: -100, y: -100 }, { x: -10, y: -10 }, {x: 0, y: 0}],
      expected: { x: -10, y: -10 },
    }
  ]

  for (const t of testcases) {
    const {
      input: [lower, target, upper],
      expected,
    } = t
    expect(boundWithin(lower, target, upper)).toEqual(expected)
  }
})
