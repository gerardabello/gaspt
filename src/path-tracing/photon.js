import Vector3 from './vector.js'

class Photon {
  constructor (ray, energy, filter) {
    this.ray = ray
    this.energy = energy
    this.filter = filter
    this.bounces = 0
  }

  addEmission (emission) {
    this.energy = Vector3.add(this.energy, Vector3.mul(this.filter, emission))
  }

  addFilter (color) {
    this.filter = Vector3.mul(this.filter, color)
  }

  bounce (pos, dir) {
    this.bounces += 1
    this.ray.o = pos
    this.ray.d = dir
    this.ray.length = Infinity
  }
}

export default Photon
