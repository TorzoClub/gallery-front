import React, { useState, useEffect, useCallback } from 'react'

import vait from 'vait'

import { confirmQQNum } from 'api/member'
import { fetchList, fetchListWithQQNum, vote } from 'api/photo'

import Loading from 'components/Loading'

import Gallery from 'components/Gallery'

// import BgImageUrl from 'assets/bg.png'

import HomeContext from './context'

import ConfirmQQ from 'components/ConfirmQQ'

import PhotoDetail from 'components/Detail'
import GuideLayout from 'components/GuideLayout'
import SubmitButton from 'components/SubmitButton'

const useStateObject = (initObj) => {
  const [obj, setObj] = useState(initObj)
  
  let newObj = { ...obj }
  return [obj, (appendObj) => {
    newObj = { ...obj, ...newObj, ...appendObj }
    return setObj(newObj)
  }]
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

function updateListItem(list, findFn, updateFn) {
  return list.map((item) => {
    return findFn(item) ? { ...item, ...updateFn({ ...item }) } : item
  })
}

function updateListItemByProperty(list, findProperty, propertyValue, updateData) {
  return updateListItem(
    list,
    (item) => item[findProperty] === propertyValue,
    () => updateData
  )
}

function updateListItemById(list, id, updateData) {
  return updateListItemByProperty(list, 'id', id, updateData)
}

function exchangePos(arr, idxA, idxB) {
  arr = [...arr]
  const tmp = arr[idxA]
  arr[idxA] = arr[idxB]
  arr[idxB] = tmp
  return arr
}

function randomNum(length) {
  return Math.floor(Math.random() * length)
}

function _shuffleArray(arr, idx) {
  if (arr.length < 2) {
    return arr
  } else if (idx < arr.length) {
    return _shuffleArray(
      exchangePos(arr, idx, randomNum(arr.length)),
      idx + 1
    )
  } else {
    return arr
  }
}

function curryRight(f) {
  return b => a => f(a, b)
}

const shuffleArray = curryRight(_shuffleArray)(0)

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
}) {
  const [arrowTickTock, setArrowTickTock] = useState(null)

  const showSubmitButton = !active.vote_submitted
  let isSubmitted = submittedPool[active.id]
  let buttonMode = ''

  if (isSubmitted) {
    buttonMode = 'done'
  } else if (confirmState.in) {
    buttonMode = 'blue'
  } else if (selectedIdList.length) {
    buttonMode = 'blue ring'
  }

  return (
    <HomeContext.Provider value={{
      toDetail,
      selectedIdList,
      handleClickVote(gallery, photo) {
        console.warn('handleClickVote', gallery.vote_submitted, photo)

        const isSubmitted = submittedPool[gallery.id]

        if (isSubmitted || gallery.is_expired || gallery.vote_submitted) {
          return
        }

        const { id } = photo
  
        let newSelectedIdList = [...selectedIdList]

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
      },
    }}>
      <div className="gallery-wrapper">
        <Gallery hideVoteButton={hideVoteButton} gallery={active} />

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
                      clickButton={e => {
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

            <style jsx>{`
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
    </HomeContext.Provider>
  )
}

export default (props) => {
  const [loaded, setLoaded] = useState(false)

  const [showArrow, setShowArrow] = useState(false)

  const [hideVoteButton, setHideVoteButton] = useState(true)

  const [selectedIdList, setSelectedIdList] = useState([])
  
  const [submiting, setSubmiting] = useState(false)
  
  const [active, _setActive] = useState(null)
  const [list, setList] = useState([])

  const [submittedPool, setSubmittedPool] = useState({})

  // const [showDetail, setShowDetail] = useState(false)
  // const [detailImageUrl, setDetailImageUrl] = useState('')
  const [imageDetail, setImageDetail] = useState(null)
  const [currentQQNum, setCurrentQQNum] = useState(0)
  const [confirmState, setConfirmState] = useStateObject({
    in: false,
    isDone: false,
    isLoading: false,
    isFailure: null,
    disableInput: false
  })

  const setActive = useCallback((newValue) => {
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
            setActive(active)
            setList(galleries)

            setSelectedIdList(
              active.photos
                .filter(photo => photo.is_voted)
                .map(photo => photo.id)
            )

            setConfirmState({ in: false })

            vait.timeout(618).then(() => {
              setHideVoteButton(false)
              setShowArrow(true)
            })
          }).catch(err => {
            alert(`获取投票信息失败: ${err.message}`)
          })
        })
      }
    }).catch(err => {
      alert(`获取相册信息失败: ${err.message}`)
    })
  }, [currentQQNum])

  const ConfirmQQLayout = (
    <ConfirmQQ
      {...confirmState}
      handleInputChange={() => {
        setConfirmState({
          isFailure: null
        })
      }}
      handlesubmitDetect={async qq_num => {
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
          setConfirmState({ isLoading: false, isFailure: err })
        }
      }}
    />
  )

  const handleClickSubmit = async () => {
    try {
      setSubmiting(true)

      if (!currentQQNum) {
        // 未缓存 Q 号
        return setConfirmState({
          in: true,
          isLoading: false,
          isFailure: false
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
    } catch (err) {
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
      <div className={`gallery-home`} style={{ minHeight: '100vh' }}>
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

                  toDetail: (detail) => setImageDetail(detail),
                  onClickSubmit: () => handleClickSubmit(),
                }}/>
              )}

              <HomeContext.Provider
                value={{
                  toDetail: (detail) => setImageDetail(detail)
                }}
              >
                {
                  list.map(gallery => {
                    return (
                      <div className="gallery-wrapper" key={gallery.id}>
                        <Gallery hideVoteButton={hideVoteButton} gallery={gallery} />
                      </div>
                    )
                  })
                }
              </HomeContext.Provider>

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

        <style jsx>{`
          .gallery-home {
            padding-bottom: 64px;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  )
}
