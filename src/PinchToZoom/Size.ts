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

export { Size, scale, diff }
