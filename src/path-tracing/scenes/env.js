import { loadImageData } from '../environment'

import envImage from '../../../images/environments/grace-probe.png'

async function getEnvScene () {
  return {
    enviroment: await loadImageData(envImage),
    camera: {
      position: [50, 80, 250.6],
      direction: [0, -0.35, -1],
      fov: 0.5135
    },
    objects: [
      {
        name: 'bottom',
        type: 'sphere',
        radius: 1e5,
        position: [50, -1e5, 81.6],
        material: {
          type: 'diffuse',
          color: [0.75, 0.75, 0.75]
        }
      },
      {
        name: 'mirror',
        type: 'sphere',
        radius: 16.5,
        position: [26, 16.5, 0],
        material: {
          type: 'specular',
          color: [0.7, 0.8, 0.6]
        }
      },
      {
        name: 'rough mirror',
        type: 'sphere',
        radius: 16.5,
        position: [64, 16.5, 20],
        material: {
          type: 'specular',
          color: [0.7, 0.5, 0.5],
          roughness: 0,
          fresnel: 0.9
        }
      },
      {
        name: 'glass',
        type: 'sphere',
        radius: 16.5,
        position: [79, 16.5, 78],
        material: {
          type: 'refractive',
          color: [0.8, 0.9, 0.999]
        }
      },
      {
        name: 'diffuse',
        type: 'sphere',
        radius: 16.5,
        position: [32, 16.5, 95],
        material: {
          type: 'diffuse',
          color: [0.4, 0.7, 0.5]
        }
      },
      {
        type: 'sphere',
        radius: 16.5,
        position: [-50, 50, 150],
        material: {
          type: 'emission',
          emission: [12.0, 12.0, 12.0]
        }
      } // Light
    ]
  }
}

export default getEnvScene
