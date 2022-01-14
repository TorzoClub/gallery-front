import React, { Component } from 'react'

import GalleryHome from './layouts/GalleryHome'
import BgImageUrl from 'assets/bg.png'

import './App.css'

class App extends Component {
  // constructor() {
  //   super()
  // }

  render() {
    const { store } = this.props

    return (
      <div className="app">
        <GalleryHome
          store={ store }
        />

        <style jsx>{`
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
