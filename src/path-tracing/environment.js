import Vector3 from './vector.js'

export const loadImageData = path => {
  const image = document.createElement('img')
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  return new Promise((resolve, reject) => {
    image.src = path
    image.addEventListener('load', () => {
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
        .data
      resolve({ pixels, w: image.width, h: image.height })
    })
  })
}

class Environment {
  constructor (value) {
    if (value instanceof Vector3) {
      this.type = 'color'
      this.color = value.copy()
    } else if (value == null) {
      this.type = 'color'
      this.color = new Vector3(0, 0, 0)
    } else if (Array.isArray(value)) {
      this.type = 'color'
      this.color = new Vector3(value)
    } else {
      this.type = 'image'
      this.pixels = value.pixels
      this.imgHeight = value.h
      this.imgWidth = value.w
    }
  }

  getUVValue (u, v) {
    const x = u * this.imgWidth
    const y = v * this.imgHeight
    const index = (Math.floor(y) * this.imgWidth + Math.floor(x)) * 4
    const rgb = new Vector3(
      this.pixels[index],
      this.pixels[index + 1],
      this.pixels[index + 2]
    )
    const scale = rgb.length > 441 ? 2 : 1
    return Vector3.scale(rgb, scale / 255)
  }

  background (dir) {
    if (this.type === 'color') {
      return this.color
    }

    const d = Math.sqrt(dir.x * dir.x + dir.y * dir.y)
    const r = 0.159154943 * Math.acos(dir.z) / d
    const u = 0.5 + dir.x * r
    const v = 0.5 + dir.y * -r

    return this.getUVValue(u, v)
  }
}

export default Environment
