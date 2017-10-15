import Diffuse from './diffuse'
import Specular from './specular'
import Refractive from './refractive'
import Emission from './emission'
import Mix from './mix'

export const unmarshal = def => {
  switch (def.type) {
    case 'diffuse':
      return new Diffuse(def)
    case 'specular':
      return new Specular(def)
    case 'refractive':
      return new Refractive(def)
    case 'emission':
      return new Emission(def)
    case 'mix':
      return new Mix(def)
  }
}
