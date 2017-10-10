import { M_PI } from './math_tools.js'
import Vector3 from './vector.js'

export function uniformSampleOnHemisphere (u1, u2) {
  let sinTheta = Math.sqrt(Math.max(0.0, 1.0 - u1 * u1))
  let phi = 2.0 * M_PI * u2
  return new Vector3(Math.cos(phi) * sinTheta, Math.sin(phi) * sinTheta, u1)
}

export function cosineSampleOnHemisphere (u1, u2) {
  let cosTheta = Math.sqrt(1.0 - u1)
  let sinTheta = Math.sqrt(u1)
  let phi = 2.0 * M_PI * u2
  return new Vector3(
    Math.cos(phi) * sinTheta,
    Math.sin(phi) * sinTheta,
    cosTheta
  )
}
