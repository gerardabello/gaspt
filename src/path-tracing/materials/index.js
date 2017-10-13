import Diffuse from './diffuse'
import Specular from './specular'
import Refractive from './refractive'
import Emission from './emission'

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
  }
}
