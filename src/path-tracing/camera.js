import Vector3 from './vector'
import Ray from './ray'
import { uniform } from './random'

export default class Camera {
  constructor (position, direction, width, height, fov, scaling = 1) {
    this.position = position
    this.direction = direction
    this.width = width * scaling
    this.height = height * scaling
    this.cx = new Vector3(this.width * fov / this.height, 0.0, 0.0)
    this.cy = Vector3.scale(
      Vector3.cross(this.cx, this.direction).normalize(),
      fov
    )
  }

  getDirection (x, y, sx, sy) {
    let u1 = 2.0 * uniform()
    let u2 = 2.0 * uniform()
    let dx = u1 < 1 ? Math.sqrt(u1) - 1.0 : 1.0 - Math.sqrt(2.0 - u1)
    let dy = u2 < 1 ? Math.sqrt(u2) - 1.0 : 1.0 - Math.sqrt(2.0 - u2)
    return Vector3.add(
      Vector3.add(
        Vector3.scale(this.cx, ((sx + 0.5 + dx) / 2.0 + x) / this.width - 0.5),
        Vector3.scale(this.cy, ((sy + 0.5 + dy) / 2.0 + y) / this.height - 0.5)
      ),
      this.direction
    )
  }

  getRay (x, y, sx, sy) {
    const d = this.getDirection(x, y, sx, sy)

    return new Ray(
      Vector3.add(this.position, Vector3.scale(d, 130)),
      d.normalize(),
      Infinity
    )
  }
}
