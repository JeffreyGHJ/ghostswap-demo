const hsl2rgb = (h, s, b) => {
  h *= 6
  s = [(b += s *= b < 0.5 ? b : 1 - b), b - (h % 1) * s * 2, (b -= s *= 2), b, b + (h % 1) * s, b + s]

  return [
    s[~~h % 6] * 255, // red
    s[(h | 16) % 6] * 255, // green
    s[(h | 8) % 6] * 255, // blue
  ]
}

const getIdenticonColor = (address) => {
  const hue = parseInt(address.substr(-7), 16) / 0xfffffff
  const saturation = 0.7
  const brightness = 0.5
  return hsl2rgb(hue, saturation, brightness)
}

export default getIdenticonColor
