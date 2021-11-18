import vait from 'vait'
import React, { useRef, useEffect, useState } from 'react'
import useDisableScroll from 'hooks/useDisableScroll'

import './style.scss'

const getCenter = (totalLength, length) => (totalLength / 2) - (length / 2)

const IMAGE_PADDING = 50
const calcImageFullScreenPos = ({ width: imgW, height: imgH }, GLOBAL = window) => {
  const { innerWidth, innerHeight } = GLOBAL
  const imageProportion = imgH / imgW

  const newImgW = innerWidth
  const newImgH = innerWidth * imageProportion

  if (newImgH > innerHeight) {
    // 缩放的图的高度大于窗口高度
    console.error('>', newImgH, innerHeight)
    const height = innerHeight - (IMAGE_PADDING * 2)
    const width = height / imageProportion

    return {
      top: IMAGE_PADDING,
      left: getCenter(innerWidth, width),
      width,
      height
    }
  } else {
    // 缩放的图的高度小于等于窗口高度
    console.error('<=', newImgH, innerHeight)
    

    if (newImgH / innerHeight > 0.80) {
      // 图片是否较长，是的话就适当留空白
      const width = newImgW - (IMAGE_PADDING * 2)
      const height = width * imageProportion
      return {
        top: getCenter(innerHeight, height),
        left: IMAGE_PADDING,
        width,
        height,
      }
    } else {
      const width = newImgW
      const height = width * imageProportion
      return {
        top: getCenter(innerHeight, height),
        left: 0,
        width,
        height,
      }
    }
  }
}

export default ({
  detail,
  onCancel = () => undefined
}) => {
  const detailFrameEl = useRef(null)
  const imageFrameEl = useRef(null)
  const [touchStart, setTouchStart] = useState(null)
  const [touchMove, setTouchMove] = useState(null)

  const [isShow, setIsShow] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const [sourceUrl, setSourceUrl] = useState('')
  const [thumbUrl, setThumbUrl] = useState('')
  const [fromPos, setFromPos] = useState(null)
  const [toPos, setToPos] = useState(null)
  const [imageFrameTransition, setImageFrameTransition] = useState(false)

  useEffect(() => {
    if (detail) {
      setIsShow(true)
      // setOpacity(1)

      setThumbUrl(detail.from.thumb)
      setSourceUrl(detail.src)

      const { top, left, width, height } = detail.from
      // setImageFrameTransition(false)
      setFromPos({
        top,
        left,
        width,
        height,
      })

      // return () => {
      //   setOpacity(0)
      // }
    } else {
      setImageFrameTransition(true)
      setToPos(null)
      setTouchMove(null)
      setTouchStart(null)
      setOpacity(0)

      let firstV = vait.timeout(382)
      let secondV

      firstV.then(() => {
        setThumbUrl('')
        setSourceUrl('')
        setFromPos(null)
        setToPos(null)
        setImageFrameTransition(false)

        secondV = vait.timeout(382)
        return secondV
      }).then(() => {
        setIsShow(false)
      })

      return () => {
        setOpacity(1)
        firstV && firstV.clear()
        secondV && secondV.clear()
      }
    }
  }, [detail])

  useEffect(() => {
    if (!fromPos) {
      return
    }

    let timingV

    window.requestAnimationFrame(() => {
      setImageFrameTransition(true)
      setToPos({
        ...calcImageFullScreenPos({
          width: detail.width,
          height: detail.height
        })
      })
      timingV = vait.timeout(382)
      timingV.then(() => {
        setImageFrameTransition(false)
      })
    })

    return () => {
      timingV && timingV.clear()
    }
  }, [fromPos])

  useEffect(() => {
    const resizeHandle = () => {
      console.log('resizeHandle', fromPos)
      if (!fromPos) {
        return
      }

      setImageFrameTransition(true)
      setToPos({
        ...calcImageFullScreenPos({
          width: detail.width,
          height: detail.height
        })
      })
    }
    window.addEventListener('resize', resizeHandle)

    return () => {
      window.removeEventListener('resize', resizeHandle)
    }
  }, [fromPos])

  useEffect(() => {
    if (!imageFrameEl.current) {
      return
    }

    const { current: el } = imageFrameEl

    const touchStartHandler = (e) => {
      const { touches } = e
      if (touches.length !== 1) {
        // 不是单指操作的情况
        return
      }

      e.stopPropagation()
      e.preventDefault()

      const touch = touches[0]
      
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY
      })
    }
    const touchMoveHandler = (e) => {
      const { touches } = e
      if (touches.length !== 1) {
        // 不是单指操作的情况
        return
      }

      e.stopPropagation()
      e.preventDefault()

      const touch = touches[0]
      const willWrite = { ...touchMove }
      if ((touch.clientX >= 0) && (touch.clientX < window.innerWidth)) {
        willWrite.x = touch.clientX
      }
      if ((touch.clientY >= 0) && (touch.clientY < window.innerHeight)) {
        willWrite.y = touch.clientY
      }
      setTouchMove(willWrite)
    }

    let touchEndVait

    const touchEndHandler = (e) => {
      const { changedTouches: touches } = e
      if (touches.length !== 1) {
        // 不是单指操作的情况
        return
      }

      e.stopPropagation()
      e.preventDefault()

      const touch = touches[0]

      if (!touchStart) {
        return
      }

      const diffY = touch.clientY - touchStart.y

      if (diffY > 100) {
        onCancel()
      } else if (!touchMove) {
        // 触屏点击的情况
        onCancel()
      } else {
        setImageFrameTransition(true)
        setTouchStart(null)
        setTouchMove(null)
        touchEndVait = vait.timeout(382).then(() => {
          setImageFrameTransition(false)
        })
      }
    }

    el.addEventListener('touchstart', touchStartHandler)
    el.addEventListener('touchmove', touchMoveHandler)
    el.addEventListener('touchend', touchEndHandler)
    return () => {
      el.removeEventListener('touchstart', touchStartHandler)
      el.removeEventListener('touchmove', touchMoveHandler)
      el.removeEventListener('touchend', touchEndHandler)

      touchEndVait && touchEndVait.clear()
    }
  }, [imageFrameEl.current, touchStart, touchMove])

  useEffect(() => {
    if (!detailFrameEl.current) {
      return
    }

    const { current: el } = detailFrameEl
    const touchMoveHandler = (e) => {
      if (detail) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    el.addEventListener('touchmove', touchMoveHandler)

    return () => {
      el.removeEventListener('touchmove', touchMoveHandler)
    }
  }, [detail, detailFrameEl.current])

  useDisableScroll(Boolean(detail))

  const handleClickFrame = (e) => {
    onCancel()
  }

  if (!isShow) {
    return null
  }

  const pos = {
    ...(toPos || fromPos || {})
  }

  if (touchStart && touchMove) {
    // const x = touchMove.x - touchStart.x
    const x = 0
    let y = touchMove.y - touchStart.y

    const totalLength = window.innerHeight - (touchMove.y)
    let b = y / totalLength
    // console.log('y', y, b)

    if (b > 1) {
      console.error('bbbbbbbb')
      b = 1
    }

    y = b * 100

    pos.transform = `translate(${x}px, ${y}px)`
  }

  return (
    <div
      ref={detailFrameEl}
      className="detail-frame"
      onClick={handleClickFrame}
    >
      <div className="bgMask" style={{ opacity }}></div>
      <div
        ref={imageFrameEl}
        className={`imageFrame ${imageFrameTransition ? 'transition' : ''}`}
        style={{ ...pos, opacity: toPos ? 1 : 0 }}
      >
        <img className="thumb" src={thumbUrl} alt="" />
        <img className="source" src={sourceUrl} alt="" />
      </div>
    </div>
  )
}
