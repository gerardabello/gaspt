import Vector3 from '../vector'
import { uniform } from '../random'
import { clamp } from '../math_tools'
import { projectSample, idealSpecularReflect } from './utils'

import { cosineSamplePowerOnHemisphere } from '../sampling'

class Specular {
  constructor ({ color, roughness = 0 }) {
    this.color = new Vector3(color)
    this.roughness = roughness
  }

  reflect (photon, iPos, iNorm) {
    const n =
      Vector3.dot(iNorm, photon.ray.d) < 0 ? iNorm : Vector3.minus(iNorm)

    let d = idealSpecularReflect(photon.ray.d, n)
    if (this.roughness !== 0) {
      d = Vector3.lerp(this.roughness, d, n)

      let sampleDir = cosineSamplePowerOnHemisphere(
        uniform(),
        uniform(),
        1000 - Math.pow(this.roughness, 0.1) * 1000
      )

      d = projectSample(d, sampleDir)
    }

    photon.addFilter(this.color)
    photon.bounce(iPos, d)
    return true
  }
}

export default Specular
