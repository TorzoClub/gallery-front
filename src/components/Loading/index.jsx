import React, { useEffect, useState } from 'react'
import style from './index.module.scss'
export default () => {
  const [lineList, setLineList] = useState([
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0
  ])

  useEffect(() => {
    let i = 0
    let latestTime = null
    const frame = time => {
      if (latestTime === null) {
        latestTime = time
      }

      if ((time - latestTime) < 75) {
        handler = requestAnimationFrame(frame)
        return
      } else {
        latestTime = time
      }

      if (i >= lineList.length) {
        i = 0
      }

      const newLineList = [...lineList]
      newLineList[i] = 1
      setLineList(newLineList.map(v => v))
      i += 1

      handler = requestAnimationFrame(frame)
    }

    let handler = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(handler)
  }, [])

  return (
    <div className={style.loading}>
      <div className={style['loading-block']}>
        {
          lineList.map((highlight, index, total) => {
            const className = `${style['loading-block-line']} ${highlight && style['highlight']}`
            return <div
              key={index}
              className={className}
              style={{
                transform: `rotate(${(360 / total.length) * index}deg)`
              }}
            ></div>
          })
        }
      </div>
    </div>
  )
}
