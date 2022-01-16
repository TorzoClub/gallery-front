import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import heartIMG from 'assets/heart.png'
import heartHighlightIMG from 'assets/heart-highlight.png'
import style from './index.scss'

import { useQueueload } from 'utils/queue-load'

export type ImageInfo = {
  width: number
  height: number
  src_thumb: string
  src: string
}

export type CoverClickEvent = {
  from: {
    height: number
    width: number
    top: number
    left: number
  },
  thumbBlobUrl: string
}
export type Props = {
  screen: string
  gutter: CSSProperties['width']
  boxWidth: string

  hideVoteButton: boolean
  hideMember: boolean
  voteIsHighlight: boolean

  name: string | null
  photo: ImageInfo
  avatar: ImageInfo | null

  handleClickVote(): void
  onClickCover(clickInfo: CoverClickEvent): void
}

export default (props: Props) => {
  const { screen, gutter, boxWidth, photo, hideMember, avatar } = props

  const [loaded, setLoaded] = useState(false)

  const [thumb, loadPhotoThumb] = useQueueload()
  const [avatarThumb, loadAvatarThumb] = useQueueload()

  const coverFrameEl = useRef<HTMLDivElement>(null)

  const ratio = (photo.height / photo.width).toFixed(4)

  const isMobile = screen === 'mobile'

  let height: CSSProperties['height']
  if (isMobile) {
    height = `calc((${boxWidth} - ${gutter} / 2) * ${ratio})`
  } else {
    height = `calc((${boxWidth} - ${style['avatar-size']} / 2) * ${ratio})`
  }

  const coverFrameStyle = {
    height,
    background: loaded ? 'white' : ''
  }

  useEffect(() => {
    if (avatar) {
      loadAvatarThumb(avatar.src_thumb)
    }
    loadPhotoThumb(photo.src_thumb)
  }, [avatar, loadAvatarThumb, loadPhotoThumb, photo.src_thumb])

  return (
    <div className={`image-box-wrapper ${screen}`}>
      <div className="image-box">
        <div
          className={`cover-area ${hideMember ? 'front-index bottom-radius bottom-shadow' : ''}`}
          ref={coverFrameEl}
          style={coverFrameStyle}
          onClick={async () => {
            if (!coverFrameEl.current) {
              return
            }

            const {
              height,
              width,
              top,
              left
            } = coverFrameEl.current.getBoundingClientRect()

            props.onClickCover({
              from: {
                height,
                width,
                top,
                left,
              },
              thumbBlobUrl: thumb
            })
          }}
        >
          <img
            className="cover"
            alt="img"
            src={thumb}
            style={{ opacity: loaded ? 100 : 0 }}
            onLoad={() => {
              setLoaded(true)
            }}
          />

          {/* <div className="highlight"></div> */}
        </div>

        <div className="bottom-area">
          {
            hideMember || (
              <div className="bottom-block">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    <div className="avatar-inner" style={{ transform: avatarThumb ? 'translateY(0px)' : 'translateY(-100%)', backgroundImage: `url(${avatarThumb})` }}></div>
                  </div>
                </div>

                <div className="member-name"><div className="avatar-float"></div><span className="name-label">{props.name}</span></div>
              </div>
            )
          }

          {
            props.hideVoteButton || (
              <div className="back-bottom-wrapper">
                <div className="back-bottom">
                  <div className="block-wrapper" onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()

                    props.handleClickVote()
                  }}>
                    {
                      props.voteIsHighlight ?
                        <div className="block highlight">
                          <div className="heart" style={{ backgroundImage: `url(${heartHighlightIMG})` }} />
                        </div>
                        :
                        <div className="block">
                          <div className="heart" style={{ backgroundImage: `url(${heartIMG})` }} />
                        </div>
                    }
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
