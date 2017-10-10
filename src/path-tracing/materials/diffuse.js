import Vector3 from '../vector'

import { cosineSampleOnHemisphere } from '../sampling'

import { uniform } from '../random'

const vy = new Vector3(0.0, 1.0, 0.0)
const vx = new Vector3(1.0, 0.0, 0.0)

class Diffuse {
  constructor (color) {
    this.color = new Vector3(color)
  }

  reflect (photon, iPos, iNorm) {
    photon.addFilter(this.color)
    let w = Vector3.dot(iNorm, photon.ray.d) < 0 ? iNorm : Vector3.minus(iNorm)
    let u = Vector3.cross(Math.abs(w.x) > 0.1 ? vy : vx, w).normalize()
    let v = Vector3.cross(w, u)

    let sampleDir = cosineSampleOnHemisphere(uniform(), uniform())

    let d = Vector3.add(
      Vector3.add(Vector3.scale(u, sampleDir.x), Vector3.scale(v, sampleDir.y)),
      Vector3.scale(w, sampleDir.z)
    ).normalize()

    photon.bounce(iPos, d)

    return true
  }
}

export default Diffuse
