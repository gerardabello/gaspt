import Diffuse from './diffuse'
import Specular from './specular'
import Refractive from './refractive'
import Emission from './emission'

export const unmarshal = def => {
  switch (def.type) {
    case 'diffuse':
      return new Diffuse(def.color)
    case 'specular':
      return new Specular(def.color, def.roughness, def.fresnel)
    case 'refractive':
      return new Refractive(def.color)
    case 'emission':
      return new Emission(def.emission)
  }
}
