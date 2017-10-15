import { unmarshal } from '.'

class Mix {
  constructor ({ mix, materials }) {
    if (materials.length !== 2) {
      throw new Error('Mix must use two materials')
    }
    this.materials = materials.map(unmarshal)
    this.mix = mix
  }

  reflect (photon, iPos, iNorm) {
    let mat
    if (Math.random() > this.mix) {
      mat = this.materials[0]
    } else {
      mat = this.materials[1]
    }

    return mat.reflect(photon, iPos, iNorm)
  }
}

export default Mix
