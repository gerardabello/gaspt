import Vector3 from '../vector'
import { clamp } from '../math_tools'

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
