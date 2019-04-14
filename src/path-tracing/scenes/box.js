async function getBoxScene () {
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
        position: [1e5 + 1, 40.8, 81.6],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.75, 0.25, 0.25]
        }
      }, // Left
      {
        type: 'sphere',
        radius: 1e5,
        position: [-1e5 + 99, 40.8, 81.6],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.25, 0.25, 0.75]
        }
      }, // Right
      {
        type: 'sphere',
        radius: 1e5,
        position: [50, 40.8, 1e5],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.75, 0.75, 0.75]
        }
      }, // Back
      {
        type: 'sphere',
        radius: 1e5,
        position: [50, 40.8, -1e5 + 170],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.0, 0.0, 0.0]
        }
      }, // Front
      {
        type: 'sphere',
        radius: 1e5,
        position: [50, 1e5, 81.6],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.75, 0.75, 0.75]
        }
      }, // Bottom
      {
        type: 'sphere',
        radius: 1e5,
        position: [50, -1e5 + 81.6, 81.6],
        material: {
          type: 'diffuse',
          emission: [0,0,0],
          color: [0.75, 0.75, 0.75]
        }
      }, // Top
      {
        type: 'sphere',
        radius: 16.5,
        position: [27, 16.5, 47],
        material: {
          type: 'specular',
          emission: [0,0,0],
          color: [0.999, 0.999, 0.999]
        }
      }, // Mirror
      {
        type: 'sphere',
        radius: 16.5,
        position: [73, 16.5, 78],
        material: {
          type: 'refractive',
          emission: [0,0,0],
          color: [0.999, 0.999, 0.999],
        }
      }, // Glass
      {
        type: 'sphere',
        radius: 600,
        position: [50, 681.6 - 0.27, 81.6],
        material: {
          type: 'emission',
          emission: [12.0, 12.0, 12.0],
          color: [1,1,1]
        }
      } // Light
    ]
  }
}

export default getBoxScene
