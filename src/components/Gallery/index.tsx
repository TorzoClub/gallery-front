import React, { useContext, useEffect, useState } from 'react'

import './index.scss'

import Title from 'components/Title'
import PhotoStream from 'components/PhotoStream'
import HomeContext from 'layouts/GalleryHome/context'

export type PhotoStreamState = {
  screen: 'normal' | 'mobile'
  column_count: number
  gallery_width: string
  column_gutter: string
}
const getPhotoStreamState = (): PhotoStreamState => {
  if (window.innerWidth > 1200) {
    return {
      screen: 'normal',
      column_count: 4,
      gallery_width: '1200px',
      column_gutter: '24px'
    }
  } else if (window.innerWidth > 640) {
    return {
      screen: 'normal',
      column_count: 3,
      gallery_width: '640px',
      column_gutter: '16px'
    }
  } else {
    return {
      screen: 'mobile',
      column_count: 2,
      gallery_width: '100vw',
      column_gutter: '12px'
    }
  }
}

export default (props) => {
  const [state, setState] = useState(getPhotoStreamState())
  const context = useContext(HomeContext)

  useEffect(() => {
    let lastWidth: number

    setState(getPhotoStreamState())

    const resizeHandler = () => {
      // const { lastWidth } = this
      const { innerWidth } = window
      if (lastWidth !== innerWidth) {
        lastWidth = innerWidth
        setState(getPhotoStreamState())
      }
    }
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
        screen={screen}
        column_count={column_count}
        total_width={gallery_width}
        gallery={gallery}
        photos={gallery.photos}
        gutter={column_gutter}

        onClickVote={(photoId) => {
          const idx = gallery.photos.map(p => p.id).indexOf(photoId)
          if (idx === -1) return
          const photo = gallery.photos[idx]

          context.handleClickVote(gallery, photo)
        }}
        onClickCover={(fromInfo, photoId) => {
          const idx = gallery.photos.map(p => p.id).indexOf(photoId)
          if (idx === -1) return
          const photo = gallery.photos[idx]

          // updateListItemById
          if (context.toDetail) context.toDetail({
            from: {
              ...fromInfo,
            },
            thumb: photo.thumb,
            src: photo.src,
            height: photo.height,
            width: photo.width
          })
        }}
      />
    </div>
  )
}
