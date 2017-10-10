import Vector3 from '../vector'

class Specular {
  constructor (color, roughness = 0) {
    this.color = new Vector3(color)
    this.roughness = roughness
  }

  idealSpecularReflect (d, n) {
    const dir = Vector3.sub(d, Vector3.scale(n, 2.0 * Vector3.dot(n, d)))
    if (this.roughness === 0) {
      return dir
    }
    return dir.randomInCone(this.roughness)
  }

  reflect (photon, iPos, iNorm) {
    let dRe = this.idealSpecularReflect(photon.ray.d, iNorm)
    photon.addFilter(this.color)
    photon.bounce(iPos, dRe)
    return true
  }
}

export default Specular
