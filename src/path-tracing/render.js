import initScene from './scenes/init'

import Vector3 from './vector.js'
import Camera from './camera'
import Photon from './photon'

import { uniform } from './random.js'

// Scene
let scene
let buffer

function intersectScene (ray, scene) {
  let id
  for (let i = 0; i < scene.objects.length; ++i) {
    if (scene.objects[i].intersect(ray)) {
      id = i
    }
  }
  return id
}

// Radiance
function radiance (ray, scene) {
  let photon = new Photon(
    ray,
    new Vector3(0.0, 0.0, 0.0),
    new Vector3(1.0, 1.0, 1.0)
  )

  while (true) {
    const id = intersectScene(photon.ray, scene)
    if (id == null) {
      const bg = scene.enviroment.background(photon.ray.d)
      photon.addEmission(bg)
      return photon.energy
    }

    let shape = scene.objects[id]
    let p = photon.ray.eval(photon.ray.length)
    let n = Vector3.sub(p, shape.p).normalize()

    const cont = shape.material.reflect(photon, p, n)

    if (!cont) {
      return photon.energy
    }

    // Russian roulette
    if (photon.bounces > 4) {
      let continueProbability = photon.filter.maxValue()
      if (uniform() >= continueProbability) {
        return photon.energy
      }
      photon.filter = Vector3.scale(photon.filter, 1 / continueProbability)
    }
  }
}

const setVectorFromBuffer = (buffer, i, vec) => {
  const index = i * 3
  buffer[index] = vec.x
  buffer[index + 1] = vec.y
  buffer[index + 2] = vec.z
}

const getVectorFromBuffer = (buffer, i) => {
  const index = i * 3
  return new Vector3(buffer[index], buffer[index + 1], buffer[index + 2])
}

// Main
export default function renderFrame (width, height, split, samples) {
  let nbSamples = samples

  const camera = new Camera(
    new Vector3(scene.camera.position),
    new Vector3(scene.camera.direction).normalize(),
    width,
    height,
    scene.camera.fov
  )

  let Ls = new Float32Array(camera.width * split.h * 3)

  for (let y = split.y; y < split.y + split.h; ++y) {
    // pixel row
    for (let x = 0; x < camera.width; ++x) {
      // pixel column
      // let i = (camera.height - 1 - y) * camera.width + x
      let ai = (y - split.y) * camera.width + x
      for (let sy = 0; sy < 2; ++sy) {
        // 2 subpixel row
        for (let sx = 0; sx < 2; ++sx) {
          // 2 subpixel column
          let L = new Vector3(0.0, 0.0, 0.0)
          for (let s = 0; s < nbSamples; ++s) {
            //  samples per subpixel

            const r = camera.getRay(x, y, sx, sy)

            L = Vector3.add(
              L,
              Vector3.scale(radiance(r, scene), 1.0 / nbSamples)
            )
          }
          setVectorFromBuffer(
            Ls,
            ai,
            Vector3.add(
              getVectorFromBuffer(Ls, ai),
              Vector3.scale(Vector3.clamp(L, 0.0, 1.0), 0.25)
            )
          )
        }
      }
    }
  }

  buffer.set(Ls, split.y * camera.width * 3)
}

export const init = (b, s) => {
  buffer = new Float32Array(b)
  scene = initScene(s)
}

// As worker
onmessage = function (e) {
  if (e.data.type === 'init') {
    init(e.data.payload.buffer, e.data.payload.scene)
  } else if (e.data.type === 'render') {
    const { samples, width, split, height } = e.data.payload

    renderFrame(width, height, split, samples)

    postMessage({
      type: 'render_finished'
    })
  }
}
