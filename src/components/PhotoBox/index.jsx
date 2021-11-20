import React, { useState, useContext, useEffect, useRef } from 'react'

import style from './index.scss'

import heartIMG from 'assets/heart.png'
import heartHighlightIMG from 'assets/heart-highlight.png'

import HomeContext from 'layouts/GalleryHome/context'

import loadThumb from 'utils/load-thumb'

export default (props) => {
  const context = useContext(HomeContext)
  const [loaded, setLoaded] = useState(false)
  const [thumb, setThumb] = useState('')
  const [avatarThumb, setAvatarThumb] = useState('')
  const coverFrameEl = useRef(null)

  const { screen, gutter, gallery, photo } = props
  const { member } = photo

  const ratio = (props.height / props.width).toFixed(4)

  const isMobile = screen === 'mobile'

  let height
  if (isMobile) {
    height = `calc((${props.boxWidth} - ${gutter} / 2) * ${ratio})`
  } else {
    height = `calc((${props.boxWidth} - ${style['avatar-size']} / 2) * ${ratio})`
  }

  const coverFrameStyle = {
    height,
    background: loaded ? 'white' : ''
  }

  const { selectedIdList } = context
  const isChoosed = selectedIdList && (selectedIdList.indexOf(photo.id) !== -1)
  const isHighlight = gallery.vote_submitted ? photo.is_voted : isChoosed

  useEffect(() => {
    if (member && member.avatar_thumb) {
      loadThumb(member.avatar_thumb).then(setAvatarThumb)
    }
    loadThumb(photo.thumb).then(setThumb)
  }, [member && member.avatar_thumb, photo.thumb])

  return (
    <div className={`image-box-wrapper ${screen}`}>
      <div className="image-box">
        <div
          className="cover-frame"
          ref={coverFrameEl}
          style={coverFrameStyle}
          onClick={async () => {
            const {
              height: fromHeight,
              width: fromWidth,
              top: fromTop,
              left: fromLeft
            } = coverFrameEl.current.getBoundingClientRect()
            context.toDetail && context.toDetail({
              from: {
                thumb,
                height: fromHeight,
                width: fromWidth,
                top: fromTop,
                left: fromLeft,
              },
              src: photo.src,
              height: photo.height,
              width: photo.width
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
            member && (
              <div className="bottom-block">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    <div className="avatar-inner" style={{ transform: avatarThumb ? 'translateY(0px)' : 'translateY(-100%)', backgroundImage: `url(${avatarThumb})` }}></div>
                  </div>
                </div>

                <div className="member-name"><div className="avatar-float"></div><span className="name-label">{member.name}</span></div>
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

                    context.handleClickVote(gallery, photo)
                  }}>
                    {
                      isHighlight ?
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
