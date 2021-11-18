import React, { useEffect, useState } from 'react'

import './index.scss'

import Title from 'components/Title'
import PhotoStream from 'components/PhotoStream'

const getPhotoStreamState = () => {
  if (window.innerWidth > 1200) {
    return {
      screen: 'normal',
      column_count: 4,
      gallery_width: `1200px`,
      column_gutter: '24px'
    }
  } else if (window.innerWidth > 640) {
    return {
      screen: 'normal',
      column_count: 3,
      gallery_width: `640px`,
      column_gutter: '16px'
    }
  } else {
    return {
      screen: 'mobile',
      column_count: 2,
      gallery_width: `100vw`,
      column_gutter: '12px'
    }
  }
}

export default (props) => {
  const [state, setState] = useState(getPhotoStreamState());

  useEffect(() => {
    let lastWidth

    setState(getPhotoStreamState())

    const resizeHandler = () => {
      // const { lastWidth } = this
      const { innerWidth } = window
      if (lastWidth !== innerWidth) {
        lastWidth = innerWidth
        setState(getPhotoStreamState())
      }
    };
    window.addEventListener('resize', resizeHandler)

    return () => window.removeEventListener('resize', resizeHandler)
  }, [])

  const { screen, column_count, gallery_width, column_gutter } = state
  const { hideVoteButton, gallery, toDetail } = props

  return (
    <div className="gallery">
      <Title>{gallery.name}</Title>

      <PhotoStream
        hideVoteButton={hideVoteButton}
        toDetail={toDetail}
        screen={screen}
        column_count={column_count}
        total_width={gallery_width}
        gallery={gallery}
        photos={gallery.photos}
        gutter={column_gutter}
      />
    </div>
  )
}
