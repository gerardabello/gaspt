import Vector3 from '../vector'
import { clamp } from '../math_tools'
import { uniform } from '../random'
import { cosineSampleOnHemisphere } from '../sampling'

const vy = new Vector3(0.0, 1.0, 0.0)
const vx = new Vector3(1.0, 0.0, 0.0)

export function diffuseReflect (d, n) {
  let w = Vector3.dot(n, d) < 0 ? n : Vector3.minus(n)
  let u = Vector3.cross(Math.abs(w.x) > 0.1 ? vy : vx, w).normalize()
  let v = Vector3.cross(w, u)

  let sampleDir = cosineSampleOnHemisphere(uniform(), uniform())

  return Vector3.add(
    Vector3.add(Vector3.scale(u, sampleDir.x), Vector3.scale(v, sampleDir.y)),
    Vector3.scale(w, sampleDir.z)
  ).normalize()
}

export function idealSpecularReflect (d, n, fresnel, roughness) {
  const dot = Vector3.dot(n, d)
  const dir = Vector3.sub(d, Vector3.scale(n, 2.0 * dot))
  if (roughness === 0 && fresnel === 0) {
    return dir
  }

  const f = Math.pow(dot, 2) * fresnel
  const r = roughness + f

  return dir.randomInCone(clamp(r, 0, 1))
}

export function reflectance0 (n1, n2) {
  let sqrtR0 = (n1 - n2) / (n1 + n2)
  return sqrtR0 * sqrtR0
}

export function schlickReflectance (n1, n2, c) {
  let R0 = reflectance0(n1, n2)
  return R0 + (1 - R0) * c * c * c * c * c
}

export function idealSpecularTransmit (d, n, nOut, nIn) {
  let dRe = idealSpecularReflect(d, n, 0, 0)

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
