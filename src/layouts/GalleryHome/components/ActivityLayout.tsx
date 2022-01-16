import React, { useState } from 'react'
import { GalleryInActive, Photo } from 'api/photo'
import { ConfirmQQState } from 'components/ConfirmQQ'
import { Detail } from 'components/Detail'

import { Gallery as GalleryType } from 'api/photo'
import Gallery from 'components/Gallery'
import Loading from 'components/Loading'
import GuideLayout from 'components/GuideLayout'
import SubmitButton from 'components/SubmitButton'

type ActivityLayoutProps = {
  active: GalleryInActive
  hideVoteButton: boolean
  submiting: boolean
  showArrow: boolean,
  confirmState: ConfirmQQState

  submittedPool: Record<string, number | undefined>
  selectedIdList: number[]
  setSelectedIdList: (idList: number[]) => void

  toDetail: (d: Detail) => void
  onClickSubmit: () => void
}

export default function ActivityLayout({
  active,
  hideVoteButton,
  submiting,
  showArrow,
  confirmState,

  submittedPool,
  selectedIdList,
  setSelectedIdList,

  toDetail,
  onClickSubmit,
}: ActivityLayoutProps) {
  const [arrowTickTock, setArrowTickTock] = useState(0)

  const showSubmitButton = !active.vote_submitted
  const isSubmitted = submittedPool[active.id]
  let buttonMode = ''

  if (isSubmitted) {
    buttonMode = 'done'
  } else if (confirmState.in) {
    buttonMode = 'blue'
  } else if (selectedIdList.length) {
    buttonMode = 'blue ring'
  }

  const handleClickVote = (gallery: GalleryType, photo: Photo) => {
    console.warn('handleClickVote', gallery.vote_submitted, photo)

    const isSubmitted = submittedPool[gallery.id]

    if (isSubmitted || gallery.is_expired || gallery.vote_submitted) {
      return
    }

    const { id } = photo

    const newSelectedIdList = [...selectedIdList]

    const idx = newSelectedIdList.indexOf(id)

    if (idx === -1) {
      if (gallery.vote_limit && (newSelectedIdList.length >= gallery.vote_limit)) {
        // alert('enough')
        return
      } else {
        setArrowTickTock(Date.now())
        newSelectedIdList.push(id)
      }
    } else {
      newSelectedIdList.splice(idx, 1)
      setArrowTickTock(-Date.now())
    }

    setSelectedIdList(newSelectedIdList)
  }

  return (
    <div className="gallery-wrapper">
      <Gallery
        hideVoteButton={hideVoteButton}
        gallery={active}
        selectedIdList={selectedIdList}
        onClickVote={(photoId) => {
          const idx = active.photos.map(p => p.id).indexOf(photoId)
          if (idx === -1) return
          const photo = active.photos[idx]

          handleClickVote(active, photo)
        }}
        onClickCover={({ from, thumbBlobUrl }, photoId) => {
          const idx = active.photos.map(p => p.id).indexOf(photoId)
          if (idx === -1) return
          const photo = active.photos[idx]

          toDetail({
            from,
            thumb: thumbBlobUrl,
            src: photo.src,
            height: photo.height,
            width: photo.width
          })
        }}
      />

      {showSubmitButton && (
        <div className="submit-button-wrapper">
          {(() => {
            if (submiting) {
              return <Loading />
            } else if (isSubmitted) {
              return <div className="submitted">感谢你的投票</div>
            } else {
              return (
                <GuideLayout
                  showArrow={showArrow}
                  animatedTickTock={arrowTickTock}
                >
                  <SubmitButton
                    mode={buttonMode}
                    clickButton={() => {
                      if (!showSubmitButton || isSubmitted || !selectedIdList.length || submiting) {
                        return
                      } else {
                        onClickSubmit()
                      }
                    }}
                  />
                </GuideLayout>
              )
            }
          })()}

          <style>{`
            .submit-button-wrapper {
              margin-top: 32px;

              height: 64px;
              width: 100%;

              display: flex;
              align-items: center;
              align-content: center;
              justify-content: center;
            }

            .submit-button-wrapper .submitted {
              color: #999999;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
