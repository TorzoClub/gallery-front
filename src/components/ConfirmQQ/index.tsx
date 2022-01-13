import React, { useEffect, useMemo, useRef } from 'react'
import { Transition } from 'react-transition-group';

import Loading from 'components/Loading'
import SubmitButton from 'components/SubmitButton'
import Article from './Article'
import WaitingInputFrame from './WaitingInputFrame'
import './index.scss'
import DialogLayout from 'components/DialogLayout'

export default (props) => {
  const { in: inProp, isDone, isFailure } = props

  const wifNode = useMemo(() => {
    return (
      <div className="qq-input-frame">
        <WaitingInputFrame
          isFailure={isFailure}
          disabled={props.disabled}
          handleInputChange={props.handleInputChange}
          handlesubmitDetect={props.handlesubmitDetect}
          placeholder="QQ Number"
        />
      </div>
    )
  }, [isFailure, props.disabled, props.handleInputChange, props.handlesubmitDetect])

  return (
    <DialogLayout in={Boolean(inProp)}>
      <Article />

      <div className="prompt-text">{isFailure ? isFailure.message : '以上便是我对大家的期待'}</div>

      {(() => {
        if (isDone) {
          return (
            <div className="is-done">
              可别忘了点
              <SubmitButton className="submit-btn" mode="blue ring" />
              了，朋友
            </div>
          )
        } else {
          return <>
            {wifNode}

            {
              props.isLoading && <div className="loading-wrapper">
                <Loading />
              </div>
            }
          </>
        }
      })()}
    </DialogLayout>
  )
}
