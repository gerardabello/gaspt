import Vector3 from '../vector'

import { uniform } from '../random'

const REFRACTIVE_INDEX_OUT = 1.0
const REFRACTIVE_INDEX_IN = 1.5

function idealSpecularReflect (d, n) {
  return Vector3.sub(d, Vector3.scale(n, 2.0 * Vector3.dot(n, d)))
}

function reflectance0 (n1, n2) {
  let sqrtR0 = (n1 - n2) / (n1 + n2)
  return sqrtR0 * sqrtR0
}

function schlickReflectance (n1, n2, c) {
  let R0 = reflectance0(n1, n2)
  return R0 + (1 - R0) * c * c * c * c * c
}

function idealSpecularTransmit (d, n, nOut, nIn) {
  let dRe = idealSpecularReflect(d, n)

  let outToIn = Vector3.dot(n, d) < 0
  let nl = outToIn ? n : Vector3.minus(n)
  let nn = outToIn ? nOut / nIn : nIn / nOut
  let cosTheta = Vector3.dot(d, nl)
  let cos2Phi = 1.0 - nn * nn * (1.0 - cosTheta * cosTheta)

  // Total Internal Reflection
  if (cos2Phi < 0) {
    return [dRe, 1.0]
  }

  let dTr = Vector3.sub(
    Vector3.scale(d, nn),
    Vector3.scale(nl, nn * cosTheta + Math.sqrt(cos2Phi))
  ).normalize()
  let c = 1.0 - (outToIn ? -cosTheta : Vector3.dot(dTr, n))

  let Re = schlickReflectance(nOut, nIn, c)
  let pRe = 0.25 + 0.5 * Re
  if (uniform() < pRe) {
    return [dRe, Re / pRe]
  } else {
    let Tr = 1.0 - Re
    let pTr = 1.0 - pRe
    return [dTr, Tr / pTr]
  }
}

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
