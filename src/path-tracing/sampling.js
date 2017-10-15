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

export function cosineSamplePowerOnHemisphere (u, v, m = 1) {
  const theta = Math.acos(Math.pow(1 - u, 1 / (1 + m)))
  const phi = 2 * Math.PI * v

  return new Vector3(
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(theta)
  )
}
