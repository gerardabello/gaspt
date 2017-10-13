import Vector3 from '../vector'

class Emission {
  constructor ({ emission }) {
    this.emission = new Vector3(emission)
  }

  reflect (photon, iPos, iNorm) {
    photon.addEmission(this.emission)
    return false
  }
}

export default Emission
