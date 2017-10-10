import getBoxScene from './box'
import getEnvScene from './env'
import getCausticsScene from './caustics'

const scenes = {
  box: getBoxScene(),
  caustics: getCausticsScene(),
  env: getEnvScene()
}

export default scenes
