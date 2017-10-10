require('babel-polyfill')
import React from 'react'
import ReactDOM from 'react-dom'

import App from './app.js'

export function mount ({ rootNode }) {
  ReactDOM.render(<App />, rootNode)
}

mount({
  rootNode: document.getElementById('root')
})
