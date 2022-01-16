import React, { useState, useEffect, useCallback, useMemo } from 'react'

import vait from 'vait'

import { confirmQQNum } from 'api/member'
import { fetchList, fetchListResult, fetchListWithQQNum, Gallery as GalleryType, GalleryInActive, Photo, vote } from 'api/photo'

import Loading from 'components/Loading'

import Gallery from 'components/Gallery'

// import BgImageUrl from 'assets/bg.png'

import ConfirmQQ, { ConfirmQQState } from 'components/ConfirmQQ'

import PhotoDetail, { Detail } from 'components/Detail'
import GuideLayout from 'components/GuideLayout'
import SubmitButton from 'components/SubmitButton'
import ConfirmVote from '../../components/ConfirmVote'
import shuffleArray from '../../utils/shuffle-array'
import { updateListItemById } from '../../utils/common'

type Optional<O> = { [k in keyof O]?: O[k] }

function useStateObject<S>(initObj: S) {
  const [obj, setObj] = useState<S>(initObj)

  let newObj = { ...obj }
  return [obj, (appendObj: Optional<S>) => {
    newObj = { ...obj, ...newObj, ...appendObj }
    return setObj(newObj)
  }] as const
}

function LoadingLayout() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh'
      }}
    >
      <Loading />
    </div>
  )
}

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

function ActivityLayout({
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
  const [confirmState, setConfirmState] = useStateObject<ConfirmQQState>({
    in: false,
    disabled: false,
    isDone: false,
    isLoading: false,
    isFailure: null,
  })
  const [showConfirmVoteLayout, setShowConfirmVoteLayout] = useState(false)

  const setActive = useCallback((newValue: fetchListResult['active']) => {
    if (!newValue) return

    if (active) {
      const oldPhotos = [...active.photos]
      const newPhotos = [...newValue.photos]

      newPhotos.forEach((p) => {
        updateListItemById(oldPhotos, p.id, { ...p })
      })

      _setActive({
        ...newValue,
        photos: oldPhotos,
      })
    } else {
      _setActive({
        ...newValue,
        photos: shuffleArray(newValue.photos)
      })
    }
  }, [active, _setActive])

  useEffect(() => {
    fetchList().then(({ active, galleries: list }) => {
      setList(list)
      setLoaded(true)

      const hasActive = Boolean(active)
      if (!hasActive) {
        // 没活动？那没事了
        setHideVoteButton(false)
        return
      }

      setActive(active)

      if (!currentQQNum) {
        // 没扣号的话就来个弹窗
        setConfirmState({ in: true })
      } else {
        // 有的话就用这个扣号获取已投的照片列表
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
            alert(`获取投票信息失败: ${err.message}`)
          })
        })
      }
    }).catch(err => {
      alert(`获取相册信息失败: ${err.message}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQQNum])

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

  const handleQQSubmit = useCallback(async qq_num => {
    try {
      setConfirmState({ isLoading: true })

      const [exist] = await Promise.all([confirmQQNum(qq_num), vait.timeout(1500)])

      if (exist) {
        setCurrentQQNum(qq_num)
      } else {
        setConfirmState({
          isLoading: false,
          isFailure: new Error('朋友，你这个Q号不对，再看看？')
        })
      }
    } catch (err) {
      console.error('handlesubmit error', err)
      setConfirmState({ isLoading: false, isFailure: err as Error })
    }
  }, [setConfirmState])

  const ConfirmQQLayout = (
    <ConfirmQQ
      {...confirmState}
      handleInputChange={() => {
        setConfirmState({
          isFailure: null
        })
      }}
      handlesubmitDetect={handleQQSubmit}
    />
  )

  const handleClickSubmit = async () => {
    if (!active) return

    try {
      setSubmiting(true)

      if (!currentQQNum) {
        // 未缓存 Q 号
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
      if (err.status === 403 && /已过投票截止时间/.test(err.message)) {
        alert('已经过了投票时间了，朋友，下一年再来支持吧')
        return
      } else {
        console.error(err.message)
        alert(err.message)
      }
    } finally {
      setSubmiting(false)
    }
  }

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

              {/* {normalPhotos} */}

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
