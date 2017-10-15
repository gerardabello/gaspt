import Vector3 from '../vector'

import { diffuseReflect } from './utils'

class Diffuse {
  constructor ({ color, gloss }) {
    this.color = new Vector3(color)
    this.gloss = gloss
  }

  reflect (photon, iPos, iNorm) {
    photon.addFilter(this.color)

    const d = diffuseReflect(photon.ray.d, iNorm)

    photon.bounce(iPos, d)

    return true
  }
}

export default Diffuse
