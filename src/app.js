import React, { Fragment, Component } from 'react'
import styled, { injectGlobal } from 'styled-components'

import { toByte } from './path-tracing/math_tools.js'

import { renderSync, renderAsync } from './path-tracing'
import scenes from './path-tracing/scenes'

injectGlobal`
 @import url('https://fonts.googleapis.com/css?family=Raleway:100');
`

const Root = styled.div`
  font-family: 'Raleway', sans-serif;
  background: #232323;
  color: #f1f1f1;
  height: 100%;
`

const Button = styled.button`
  background: black;
  font-size: 22px;
  border-radius: 1px;
  font-family: Raleway;
  border: 1px solid #3c3c3c;
  box-shadow: rgba(0, 0, 0, 0.47) 0 1px 6px;
  color: #d4d4d4;
  ${p => (p.disabled ? `opacity: 0.3; pointer-events: none;` : ``)};
  outline: none;

  &:active {
    border: 1px solid #4c4c4c;
  }
`

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
`
const Canvas = styled.canvas`
  margin: 20px;
  transform: scaleY(-1);
  background: #000;
  max-width: calc(100% - 40px);
`

const ControlWrapper = styled.div`
  display: flex;
  width: 100%;
`
const ControlLabelWrapper = styled.div`
  flex: 1;
  text-align: right;
  margin-right: 6px;
`
const ControlChildrenWrapper = styled.div`
  flex: 1;
  margin-left: 6px;
`

const Control = ({ children, label }) => {
  return (
    <ControlWrapper>
      <ControlLabelWrapper>{label}</ControlLabelWrapper>
      <ControlChildrenWrapper>{children}</ControlChildrenWrapper>
    </ControlWrapper>
  )
}

export default class App extends Component {
  constructor () {
    super()

    const workersEnabled = window.SharedArrayBuffer != null

    this.state = {
      workersEnabled,
      rendering: false,
      partialRenders: workersEnabled,
      useWorkers: workersEnabled,
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

  updateCavasImage (buffer, done) {
    const image = new Float32Array(buffer)
    let context = this.canvas.getContext('2d')
    const GAMMA = 2.2
    this.setState({ rendering: !done })

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

    this.setState({ rendering: true })
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
          {this.state.workersEnabled && 
              <Fragment>
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
          </Fragment>
            }
          <Button onClick={this.renderFrame} disabled={this.state.rendering}>
            Render
          </Button>
        </Controls>
      </Root>
    )
  }
}
