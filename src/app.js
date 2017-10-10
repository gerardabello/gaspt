import React, { Component } from 'react'
import styled from 'styled-components'

import { toByte } from './path-tracing/math_tools.js'

import { renderSync, renderAsync } from './path-tracing'
import scenes from './path-tracing/scenes'

const Root = styled.div``
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * + * {
    margin-top: 10px;
  }
  padding: 10px;
`
const CanvasWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #444;
`
const Canvas = styled.canvas`
  margin: 20px;
  transform: scaleY(-1);
  background: #000;
  max-width: calc(100% - 40px);
`

const ControlWrapper = styled.div``
const ControlLabel = styled.span`margin-right: 10px;`

const Control = ({ children, label }) => {
  return (
    <ControlWrapper>
      <ControlLabel>{label}</ControlLabel>
      {children}
    </ControlWrapper>
  )
}

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      partialRenders: true,
      useWorkers: true,
      scene: 'box',
      samples: 12,
      width: 256,
      height: 256
    }

    this.updateCavasImage = this.updateCavasImage.bind(this)
    this.handleSceneChange = this.handleSceneChange.bind(this)
    this.handleSamplesChange = this.handleSamplesChange.bind(this)
    this.handlePartialRendersChange = this.handlePartialRendersChange.bind(this)
    this.handleUseWorkersChange = this.handleUseWorkersChange.bind(this)
    this.renderFrame = this.renderFrame.bind(this)
  }

  updateCavasImage (buffer) {
    const image = new Float32Array(buffer)
    let context = this.canvas.getContext('2d')
    const GAMMA = 2.2

    for (let y = 0; y < this.state.height; ++y) {
      for (let x = 0; x < this.state.width; ++x) {
        const i = (y * this.state.width + x) * 3
        context.fillStyle =
          'rgba(' +
          toByte(image[i], GAMMA) +
          ', ' +
          toByte(image[i + 1], GAMMA) +
          ', ' +
          toByte(image[i + 2], GAMMA) +
          ', 1.0)'
        context.fillRect(x, y, 1, 1)
      }
    }
  }

  handleSceneChange (event) {
    this.setState({ scene: event.target.value })
  }

  handlePartialRendersChange (event) {
    this.setState({ partialRenders: event.target.checked })
  }

  handleUseWorkersChange (event) {
    this.setState({ useWorkers: event.target.checked })
  }

  handleSamplesChange (event) {
    this.setState({ samples: event.target.value })
  }

  async renderFrame () {
    const {
      samples,
      width,
      height,
      scene,
      partialRenders,
      useWorkers
    } = this.state

    if (useWorkers) {
      renderAsync({
        scene: await scenes[scene],
        width,
        height,
        samples,
        nSplits: 16,
        callback: this.updateCavasImage,
        partialRenders
      })
    } else {
      renderSync({
        scene: await scenes[scene],
        width,
        height,
        samples,
        callback: this.updateCavasImage
      })
    }
  }

  render () {
    return (
      <Root>
        <CanvasWrapper>
          <Canvas
            height={this.state.height}
            width={this.state.width}
            innerRef={comp => {
              this.canvas = comp
            }}
          />
        </CanvasWrapper>
        <Controls>
          <Control label='Scene'>
            <select value={this.state.scene} onChange={this.handleSceneChange}>
              {Object.keys(scenes).map(key => {
                return (
                  <option key={key} value={key}>
                    {key}
                  </option>
                )
              })}
            </select>
          </Control>
          <Control label='Samples'>
            <input
              type='range'
              min='1'
              max='100'
              value={this.state.samples}
              onChange={this.handleSamplesChange}
            />
          </Control>
          <Control label='Show partial renders'>
            <input
              type='checkbox'
              checked={this.state.partialRenders}
              onChange={this.handlePartialRendersChange}
            />
          </Control>
          <Control label='Use workers'>
            <input
              type='checkbox'
              checked={this.state.useWorkers}
              onChange={this.handleUseWorkersChange}
            />
          </Control>
          <button onClick={this.renderFrame}>Render</button>
        </Controls>
      </Root>
    )
  }
}
