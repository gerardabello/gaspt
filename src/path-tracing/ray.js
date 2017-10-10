import Vector3 from './vector.js'

class Ray {
  constructor (o, d, length) {
    this.o = o.copy()
    this.d = d.copy()
    this.length = length
  }

  eval (t) {
    return Vector3.add(this.o, Vector3.scale(this.d, t))
  }
}

export default Ray
