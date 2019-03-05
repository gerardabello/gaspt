import React, { Component } from 'react'
import styled, { injectGlobal, createGlobalStyle} from 'styled-components'

import { toByte } from './path-tracing/math_tools.js'

import { renderSync, renderAsync } from './path-tracing'
import scenes from './path-tracing/scenes'

const GlobalStyle = createGlobalStyle`
  #root, html, body{
    margin: 0;
    background: #232323;
  }
`

const Root = styled.div`
  font-family: monospace;
  color: #f1f1f1;
  font-size: 16px;
`

const Container = styled.div`

  height: 100%;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`
const Button = styled.button`
  font-size: 22px;
  outline: none;
  border: none;

  background: #4e4e4e;
  font-family: monospace;
  border: none;
  box-shadow: #00000052 0px 3px 4px 0;
  padding: 8px 18px;
  color: white;

`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > * + * {
    margin-top: 24px;
  }
  padding: 10px;
`
const CanvasWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Canvas = styled.canvas`
  transform: scaleY(-1);
  background: #000;
  width: 100%;
  margin: 24px 0;
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
      useWorkers: workersEnabled,
      scene: 'box',
      samples: 12,
      width: 256,
      height: 256
    }

    this.updateCavasImage = this.updateCavasImage.bind(this)
    this.handleSceneChange = this.handleSceneChange.bind(this)
    this.handleSamplesChange = this.handleSamplesChange.bind(this)
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


  handleUseWorkersChange (event) {
    this.setState({ useWorkers: event.target.checked })
  }

  handleSamplesChange (event) {
    this.setState({ samples: event.target.value })
  }

  async renderFrame () {
    this.setState({ rendering: true })

    setTimeout(async () => {
      const {
        samples,
        width,
        height,
        scene,
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
          partialRenders: true
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
    }, 80)
  }

  render () {
    return (
      <Root>
        <GlobalStyle />
        <Container>
          <CanvasWrapper>
            <Canvas
              height={this.state.height}
              width={this.state.width}
              innerRef={comp => {
                this.canvas = comp
              }}
            />
          </CanvasWrapper>
          {this.state.rendering && <div>Rendering...</div>}
          {!this.state.rendering &&
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
                {this.state.workersEnabled && (
                  <Control label='Use workers'>
                    <input
                      type='checkbox'
                      checked={this.state.useWorkers}
                      onChange={this.handleUseWorkersChange}
                    />
                  </Control>
                )}
                <Button onClick={this.renderFrame}>
                  Render
                </Button>
              </Controls>
          }
        </Container>
      </Root>
    )
  }
}
