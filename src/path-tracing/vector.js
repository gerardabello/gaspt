import { clamp } from './math_tools'
import { uniform } from './random'

class Vector3 {
  constructor (x, y, z) {
    if (Array.isArray(x)) {
      this.x = x[0]
      this.y = x[1]
      this.z = x[2]
    } else {
      this.x = x
      this.y = y
      this.z = z
    }
  }

  static minus (v) {
    return new Vector3(-v.x, -v.y, -v.z)
  }

  static add (v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
  }

  static sub (v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
  }

  static scale (v, s) {
    return new Vector3(v.x * s, v.y * s, v.z * s)
  }

  static mul (v1, v2) {
    return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z)
  }

  static dot (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  static cross (v1, v2) {
    return new Vector3(
      v1.y * v2.z - v1.z * v2.y,
      v1.z * v2.x - v1.x * v2.z,
      v1.x * v2.y - v1.y * v2.x
    )
  }

  static eq (v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z
  }

  static ne (v1, v2) {
    return v1.x !== v2.x || v1.y !== v2.y || v1.z !== v2.z
  }

  static lt (v1, v2) {
    return v1.x < v2.x && v1.y < v2.y && v1.z < v2.z
  }

  static le (v1, v2) {
    return v1.x <= v2.x && v1.y <= v2.y && v1.z <= v2.z
  }

  static gt (v1, v2) {
    return v1.x > v2.x && v1.y > v2.y && v1.z > v2.z
  }

  static ge (v1, v2) {
    return v1.x >= v2.x && v1.y >= v2.y && v1.z >= v2.z
  }

  static map (f, v) {
    return new Vector3(f(v.x), f(v.y), f(v.z))
  }

  static sqrt (v) {
    return Vector3.map(Math.sqrt, v)
  }

  static pow (v, e) {
    let fixedPow = a => a ** e
    return Vector3.map(fixedPow, v)
  }

  static abs (v) {
    return Vector3.map(Math.abs, v)
  }

  static round (v) {
    return Vector3.map(Math.round, v)
  }

  static ceil (v) {
    return Vector3.map(Math.ceil, v)
  }

  static floor (v) {
    return Vector3.map(Math.floor, v)
  }

  static trunc (v) {
    return Vector3.map(Math.trunc, v)
  }

  static clamp (v, low, high) {
    let fixedClamp = a => clamp(a, low, high)
    return Vector3.map(fixedClamp, v)
  }

  static lerp (a, v1, v2) {
    return Vector3.add(v1, Vector3.mul(a, Vector3.sub(v2, v1)))
  }

  static permute (v, x, y, z) {
    return new Vector3(v.get(x), v.get(y), v.get(z))
  }

  copy () {
    return new Vector3(this.x, this.y, this.z)
  }

  set (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  get (index) {
    switch (index) {
      case 0:
        return this.x
      case 1:
        return this.y
      default:
        return this.z
    }
  }
  getX () {
    return this.x
  }
  getY () {
    return this.y
  }
  getZ () {
    return this.z
  }

  minDimension () {
    return this.x < this.y && this.x < this.z ? 0 : this.y < this.z ? 1 : 2
  }
  maxDimension () {
    return this.x > this.y && this.x > this.z ? 0 : this.y > this.z ? 1 : 2
  }
  minValue () {
    return this.x < this.y && this.x < this.z
      ? this.x
      : this.y < this.z ? this.y : this.z
  }
  maxValue () {
    return this.x > this.y && this.x > this.z
      ? this.x
      : this.y > this.z ? this.y : this.z
  }

  norm2Squared () {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  norm2 () {
    return Math.sqrt(this.norm2Squared())
  }

  normalize () {
    let a = 1.0 / this.norm2()
    this.x *= a
    this.y *= a
    this.z *= a
    return this
  }

  static fromAngles (theta, phi) {
    return new Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi)
    )
  }
  static randomInSphere () {
    return Vector3.fromAngles(
      uniform() * Math.PI * 2,
      Math.asin(uniform() * 2 - 1)
    )
  }

  randomInCone (width) {
    const u = uniform()
    const v = uniform()
    const theta = width * 0.5 * Math.PI * (1 - 2 * Math.acos(u) / Math.PI)
    const m1 = Math.sin(theta)
    const m2 = Math.cos(theta)
    const a = v * 2 * Math.PI
    const q = Vector3.randomInSphere()
    const s = Vector3.cross(this, q)
    const t = Vector3.cross(this, s)
    let d = Vector3.scale(s, m1 * Math.cos(a))
    d = Vector3.add(d, Vector3.scale(t, m1 * Math.sin(a)))
    d = Vector3.add(d, Vector3.scale(this, m2))
    return d.normalize()
  }
}

export default Vector3
