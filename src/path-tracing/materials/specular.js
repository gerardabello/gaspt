import Vector3 from '../vector'
import { idealSpecularReflect } from './utils'

class Specular {
  constructor ({ color, roughness = 0, fresnel = 0 }) {
    this.color = new Vector3(color)
    this.roughness = roughness
    this.fresnel = fresnel
  }

  reflect (photon, iPos, iNorm) {
    let dRe = idealSpecularReflect(
      photon.ray.d,
      iNorm,
      this.fresnel,
      this.roughness
    )
    photon.addFilter(this.color)
    photon.bounce(iPos, dRe)
    return true
  }
}

export default Specular
