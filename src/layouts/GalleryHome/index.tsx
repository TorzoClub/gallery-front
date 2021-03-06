import React, { useState, useEffect, useCallback, useMemo } from 'react'
import vait from 'vait'

import { fetchList, fetchListResult, fetchListWithQQNum, vote } from 'api/photo'

// import BgImageUrl from 'assets/bg.png'

import LoadingLayout from './components/LoadingLayout'
import ActivityLayout from './components/ActivityLayout'
import useConfirmQQ from './useConfirmQQ'

import Gallery from 'components/Gallery'
import PhotoDetail, { Detail } from 'components/Detail'
import ConfirmVote from 'components/ConfirmVote'
import shuffleArray from 'utils/shuffle-array'
import { updateListItemById } from 'utils/common'

export default () => {
  const [loaded, setLoaded] = useState(false)

  const [showArrow, setShowArrow] = useState(false)

  const [hideVoteButton, setHideVoteButton] = useState(true)

  const [selectedIdList, setSelectedIdList] = useState<number[]>([])

  const [submiting, setSubmiting] = useState(false)

  const [active, _setActive] = useState<null | fetchListResult['active']>(null)
  const [list, setList] = useState<fetchListResult['galleries']>([])

  const [submittedPool, setSubmittedPool] = useState({})

  const [imageDetail, setImageDetail] = useState<Detail | null>(null)
  const [currentQQNum, setCurrentQQNum] = useState(0)

  const [ConfirmQQLayout, confirmState, setConfirmState] = useConfirmQQ({
    onConfirmSuccess(qq_num) {
      setCurrentQQNum(Number(qq_num))
    }
  })

  const [showConfirmVoteLayout, setShowConfirmVoteLayout] = useState(false)

  const setActive = useCallback((newValue: fetchListResult['active']) => {
    if (!newValue) return

    _setActive((oldActive) => {
      if (oldActive) {
        const oldPhotos = [...oldActive.photos]
        const newPhotos = [...newValue.photos]

        newPhotos.forEach((p) => {
          updateListItemById(oldPhotos, p.id, { ...p })
        })

        return {
          ...newValue,
          photos: oldPhotos,
        }
      } else {
        return {
          ...newValue,
          photos: shuffleArray(newValue.photos)
        }
      }
    })
  }, [])

  useEffect(() => {
    fetchList().then(({ active, galleries: list }) => {
      setList(list)
      setLoaded(true)

      const hasActive = Boolean(active)
      if (!hasActive) {
        // ????????????????????????
        setHideVoteButton(false)
        return
      }

      setActive(active)

      if (!currentQQNum) {
        // ??????????????????????????????
        setConfirmState({ in: true })
      } else {
        // ??????????????????????????????????????????????????????
        setConfirmState({
          isLoading: false,
          isDone: true
        })

        const fetchListResult = fetchListWithQQNum(Number(currentQQNum))

        vait.timeout(1500).then(() => {
          fetchListResult.then(({ active, galleries }) => {
            if (!active) return

            setActive(active)
            setList(galleries)

            setSelectedIdList(
              active.photos
                .filter(photo => photo.is_voted)
                .map(photo => photo.id)
            )

            setConfirmState({ in: false })
            vait.timeout(618).then(() => {
              setShowConfirmVoteLayout(true)
            })
          }).catch(err => {
            alert(`????????????????????????: ${err.message}`)
          })
        })
      }
    }).catch(err => {
      alert(`????????????????????????: ${err.message}`)
    })
  }, [currentQQNum, setActive, setConfirmState])

  const handleClickSubmit = async () => {
    if (!active) return

    try {
      setSubmiting(true)

      if (!currentQQNum) {
        // ????????? Q ???
        return setConfirmState({
          in: true,
          isLoading: false,
          isFailure: null
        })
      } else {
        await vote({
          gallery_id: active.id,
          photo_id_list: selectedIdList,
          qq_num: Number(currentQQNum)
        })

        setSubmittedPool({
          submittedPool,
          [active.id]: true
        })
      }
    } catch (err: any) {
      if (err.status === 403 && /????????????????????????/.test(err.message)) {
        alert('???????????????????????????????????????????????????????????????')
        return
      } else {
        console.error(err.message)
        alert(err.message)
      }
    } finally {
      setSubmiting(false)
    }
  }

  const handleClickAnyWhere = useCallback(() => {
    setShowConfirmVoteLayout(false)
    vait.timeout(618).then(() => {
      setHideVoteButton(false)
      setShowArrow(true)
    })
  }, [])

  const ConfirmVoteLayout = useMemo(() => (
    <ConfirmVote
      in={showConfirmVoteLayout}
      handleClickAnyWhere={handleClickAnyWhere}
    />
  ), [handleClickAnyWhere, showConfirmVoteLayout])

  return (
    <>
      <div className={'gallery-home'} style={{ minHeight: '100vh' }}>
        {
          !loaded ? (
            <LoadingLayout />
          ) : (
            <div className="body">
              {active && (
                <ActivityLayout {...{
                  active,
                  hideVoteButton,
                  submiting,
                  showArrow,
                  confirmState,

                  submittedPool,
                  selectedIdList,
                  setSelectedIdList,

                  toDetail: (detail: Detail) => setImageDetail(detail),
                  onClickSubmit: () => handleClickSubmit(),
                }} />
              )}

              {
                list.map(gallery => {
                  return (
                    <div className="gallery-wrapper" key={gallery.id} style={{ display: active ? 'none' : '' }}>
                      <Gallery
                        hideVoteButton={hideVoteButton}
                        gallery={gallery}
                        selectedIdList={[]}
                        onClickCover={({ from, thumbBlobUrl }, photoId) => {
                          const idx = gallery.photos.map(p => p.id).indexOf(photoId)
                          if (idx === -1) return
                          const photo = gallery.photos[idx]

                          setImageDetail({
                            from: from,
                            thumb: thumbBlobUrl,
                            src: photo.src,
                            height: photo.height,
                            width: photo.width
                          })
                        }}
                      />
                    </div>
                  )
                })
              }

              <PhotoDetail
                detail={imageDetail}
                // imageUrl={detailImageUrl}
                onCancel={() => {
                  setImageDetail(null)
                }}
              />
            </div>
          )
        }

        {ConfirmQQLayout}
        {ConfirmVoteLayout}

        <style>{`
          .gallery-home {
            padding-bottom: 64px;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  )
}
