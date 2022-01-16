import React, { useMemo } from 'react'
import './index.scss'

import DialogLayout, { Props as DialogLayoutProps } from 'components/DialogLayout'

import Article from './Article'
import WaitingInputFrame from './WaitingInputFrame'
import Loading from 'components/Loading'
import SubmitButton from 'components/SubmitButton'

export type ConfirmQQState = Pick<DialogLayoutProps, 'in'> & {
  isLoading: boolean
  disabled: boolean
  isDone: boolean
  isFailure: Error | null
}
export type ConfirmQQEvent = {
  handleInputChange: (s: string) => void
  handlesubmitDetect: (s: string) => void
}
export type Props = ConfirmQQState & ConfirmQQEvent

export default (props: Props) => {
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
