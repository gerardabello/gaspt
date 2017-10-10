async function getCausticsScene () {
  return {
    enviroment: [0, 0, 0],
    camera: {
      position: [50, 52, 295.6],
      direction: [0, -0.042612, -1],
      fov: 0.5135
    },
    objects: [
      {
        type: 'sphere',
        radius: 1e5,
        position: [50, 1e5, 81.6],
        emission: [0.0, 0.0, 0.0],
        color: [0.75, 0.75, 0.75],
        material: {
          type: 'diffuse',
          color: [0.75, 0.75, 0.75]
        }
      }, // Bottom
      {
        type: 'sphere',
        radius: 16.5,
        position: [30, 16.5, 68],
        material: {
          type: 'refractive',
          color: [0.999, 0.3, 0.999]
        }
      }, // Glass
      {
        type: 'sphere',
        radius: 16.5,
        position: [30, 16.5, 98],
        material: {
          type: 'refractive',
          color: [0.3, 0.999, 0.999]
        }
      }, // Glass
      {
        type: 'sphere',
        radius: 16.5,
        position: [73, 16.5, 78],
        material: {
          type: 'refractive',
          color: [0.999, 0.999, 0.999]
        }
      }, // Glass
      {
        type: 'sphere',
        radius: 16.5,
        position: [73, 16.5 * 3 + 10, 78],
        material: {
          type: 'emission',
          emission: [12.0, 12.0, 12.0]
        }
      } // Light
    ]
  }
}

export default getCausticsScene
