import React, { useEffect, useRef } from 'react'
import { Transition } from 'react-transition-group';

import SubmitButton from 'components/SubmitButton'
import style from './index.scss'
import useDisableScroll from 'hooks/useDisableScroll'

const duration = Number(style.totalAnimationDuration);

export default (props) => {
  const inputPromptEl = useRef(null)
  const bgEl = useRef(null)
  const bodyEl = useRef(null)

  const { in: inProp, handleClickAnyWhere } = props

  useEffect(() => {
    console.log('effect')
    // inputPromptEl.current.style.height = getComputedStyle(bodyEl.current).height
    // bgEl.current.style.height = inputPromptEl.current.style.height
  }, [inProp])

  useDisableScroll(Boolean(inProp))

  return (
    <Transition in={ Boolean(inProp) } timeout={duration}>
      {state => (
        <div className={ `input-prompt-wrapper ${state}` } onClick={() => handleClickAnyWhere()}>
          <div className="input-prompt" ref={inputPromptEl}>
            <div className="bg" ref={bgEl}></div>
            <div className="ip-body" ref={bodyEl}>
              {/* <Article /> */}

              <div className="is-done">
                可别忘了点下面的
                <SubmitButton className="submit-btn" mode="blue ring" />
                了，朋友
              </div>

              <div className="anywhere">点击任意位置以继续</div>
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}
