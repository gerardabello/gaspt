import Vector3 from '../vector'
import { clamp } from '../math_tools'

class Specular {
  constructor (color, roughness = 0, fresnel = 0) {
    this.color = new Vector3(color)
    this.roughness = roughness
    this.fresnel = fresnel
  }

  idealSpecularReflect (d, n) {
    const dot = Vector3.dot(n, d)
    const dir = Vector3.sub(d, Vector3.scale(n, 2.0 * dot))
    if (this.roughness === 0 && this.fresnel === 0) {
      return dir
    }

    const f = Math.pow(dot, 2) * this.fresnel
    const r = this.roughness + f

    return dir.randomInCone(r)
  }

  reflect (photon, iPos, iNorm) {
    let dRe = this.idealSpecularReflect(photon.ray.d, iNorm)
    photon.addFilter(this.color)
    photon.bounce(iPos, dRe)
    return true
  }
}

export default Specular
