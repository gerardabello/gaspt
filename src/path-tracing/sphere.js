import Vector3 from './vector.js'
import { unmarshal as unmarshalMaterial } from './materials'

export const EPSILON = 1.0e-4

export const unmarshal = def => {
  const mat = unmarshalMaterial(def.material)
  if (mat == null) {

  }
  return new Sphere(def.radius, new Vector3(def.position), mat)
}

class Sphere {
  constructor (r, p, material) {
    this.r = r
    this.p = p.copy()
    this.material = material
  }

  getMaterial () {
    return this.material
  }

  intersect (ray) {
    let op = Vector3.sub(this.p, ray.o)
    let dop = Vector3.dot(ray.d, op)
    let D = dop * dop - Vector3.dot(op, op) + this.r * this.r

    if (D < 0) {
      return false
    }

    let sqrtD = Math.sqrt(D)

    let tmin = dop - sqrtD
    if (EPSILON < tmin && tmin < ray.length) {
      ray.length = tmin
      return true
    }

    let tmax = dop + sqrtD
    if (EPSILON < tmax && tmax < ray.length) {
      ray.length = tmax
      return true
    }

    return false
  }
}

export default Sphere
