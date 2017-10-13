import Vector3 from '../vector'

import { idealSpecularTransmit } from './utils'

const REFRACTIVE_INDEX_OUT = 1.0
const REFRACTIVE_INDEX_IN = 1.5

class Refractive {
  constructor ({ color }) {
    this.color = new Vector3(color)
  }

  reflect (photon, iPos, iNorm) {
    let refractionRecord = idealSpecularTransmit(
      photon.ray.d,
      iNorm,
      REFRACTIVE_INDEX_OUT,
      REFRACTIVE_INDEX_IN
    )
    let dTr = refractionRecord[0]
    let pr = refractionRecord[1]

    photon.addFilter(this.color)
    photon.addFilter(new Vector3(pr, pr, pr))
    photon.bounce(iPos, dTr)
    return true
  }
}

export default Refractive
