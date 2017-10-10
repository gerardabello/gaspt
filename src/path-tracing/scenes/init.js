import Environment from '../environment'
import { unmarshal as unMarshalSphere } from '../sphere'

const initScene = sceneDef => {
  return Object.assign({}, sceneDef, {
    enviroment: new Environment(sceneDef.enviroment),
    objects: sceneDef.objects.map(o => unMarshalSphere(o))
  })
}

export default initScene
