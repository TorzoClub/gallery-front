import React, { Component } from 'react'

import GalleryHome from './layouts/GalleryHome'
import BgImageUrl from 'assets/bg.png'

import './App.css'

class App extends Component {
  render() {
    return (
      <div className="app">
        <GalleryHome/>
        <style>{`
          .app {
            background-image: url(${BgImageUrl});
            background-repeat: repeat;
          }
        `}</style>
      </div>
    )
  }
}

export default App
