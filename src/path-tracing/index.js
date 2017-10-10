import renderFrame, { init } from './render.js'

const RenderWorker = require('worker-loader!./render.js')

const rectSplitter = (width, height, n) => {
  const verticalSplits = n

  const splitHeight = Math.floor(height / verticalSplits)

  const splits = []

  for (let y = 0; y < verticalSplits; y++) {
    splits.push({
      y: y * splitHeight,
      h: splitHeight
    })
  }

  return splits
}

const createWorkers = (n, buffer, scene) => {
  let workers = []
  for (let i = 0; i < n; i++) {
    let worker = new RenderWorker()
    worker.postMessage({
      type: 'init',
      payload: { buffer, scene }
    })
    workers.push(worker)
  }
  return workers
}

export function renderSync ({ scene, width, height, samples = 12, callback }) {
  let buffer = new window.ArrayBuffer(width * height * 3 * 4)

  init(buffer, scene)
  const t0 = window.performance.now()
  renderFrame(width, height, { x: 0, y: 0, w: width, h: height }, samples)
  const t1 = window.performance.now()
  console.log('Rendering time: ' + (t1 - t0) + ' ms')
  callback(buffer)
}

export function renderAsync ({
  scene,
  width,
  height,
  samples = 12,
  nSplits = 16,
  callback,
  partialRenders = false
}) {
  let splits = rectSplitter(width, height, nSplits)
  splits = splits.sort(function () {
    return 0.5 - Math.random()
  })
  const totalSplits = splits.length
  let arrived = 0
  let buffer = new window.SharedArrayBuffer(width * height * 3 * 4)
  const t0 = window.performance.now()
  const nThreads = navigator.hardwareConcurrency || 4
  const workers = createWorkers(nThreads, buffer, scene)

  console.log(`Using ${nThreads} threads`)

  const launchWorker = i => {
    if (splits.length === 0) {
      return
    }
    const split = splits.pop()
    const worker = workers[i]
    worker.postMessage({
      type: 'render',
      payload: { width, height, split, samples, buffer }
    })
    worker.onmessage = catchEvent.bind(undefined, i)
  }

  const catchEvent = (i, event) => {
    if (event.data.type === 'render_finished') {
      launchWorker(i)
      arrived++

      if (partialRenders || arrived === totalSplits) {
        callback(buffer)
      }

      console.log(`progress: ${arrived}/${totalSplits}`)
      if (arrived === totalSplits) {
        const t1 = window.performance.now()
        console.log('Rendering time: ' + (t1 - t0) + ' ms')
      }
    } else {
      console.warn('Unknown message from worker')
    }
  }

  for (let i = 0; i < nThreads; i++) {
    launchWorker(i)
  }
}
