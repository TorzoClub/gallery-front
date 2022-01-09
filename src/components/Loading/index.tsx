import React, { useEffect, useState } from 'react'
import style from './index.module.scss'

const GeneratePlainLineList = () => [
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
]

export default () => {
  const [lineList, setLineList] = useState(GeneratePlainLineList())

  useEffect(() => {
    let i = 0
    let latestTime: null | number = null
    const frame = (time: number) => {
      if (latestTime === null) {
        latestTime = time
      }

      if ((time - latestTime) < 75) {
        handler = requestAnimationFrame(frame)
        return
      } else {
        latestTime = time
      }

      setLineList(lineList => {
        if (i >= lineList.length) {
          i = 0
        }

        const newLineList = GeneratePlainLineList()
        newLineList[i] = 1
        i += 1
        return newLineList
      })

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
