import React, { ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'

import style from './index.scss'
import useDisableScroll from 'hooks/useDisableScroll'

export const TotalAnimationDuration = Number(style.TotalAnimationDuration)

export type Props = {
  children: ReactNode
  in: boolean
  onClickAnyWhere?: () => void
}

export default (props: Props) => {
  const layoutEl = useRef(null)
  const bgEl = useRef(null)
  const bodyEl = useRef(null)

  const { in: inProp, onClickAnyWhere } = props

  useDisableScroll(Boolean(inProp))

  return (
    <Transition in={Boolean(inProp)} timeout={TotalAnimationDuration}>
      {state => (
        <div className={`fullscreen-layout-wrapper ${state}`} onClick={() => onClickAnyWhere && onClickAnyWhere()}>
          <div className="fullscreen-layout" ref={layoutEl}>
            <div className="bg" ref={bgEl}></div>
            <div className="fs-body" ref={bodyEl}>
              {props.children}
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}
