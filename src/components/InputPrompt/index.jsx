import React from 'react'
import { Transition } from 'react-transition-group';

import Loading from 'components/Loading'
import WaitingInputFrame from './WaitingInputFrame'
import style from './index.scss'

const duration = Number(style.totalAnimationDuration);

export default (props) => {
  const { in: inProp, isDone, isFailure } = props
  return (
    <Transition in={ Boolean(inProp) } timeout={duration}>
      {state => (
        <div className={ `input-prompt-wrapper ${state}` }>
          <div className="input-prompt">
            <div className="bg"></div>
            {(() => {
              if (isDone) {
                return <div className="ip-body">
                  <div className="prompt-text">{ '👍已提交' }</div>
                </div>
              } else {
                return <div className="ip-body">
                  <div className="prompt-text">{ isFailure ? isFailure.message : '输入Q号' }</div>
                  <WaitingInputFrame
                    isFailure={ props.isFailure }
                    disabled={ props.disabled }
                    handleInputChange={ props.handleInputChange }
                    handlesubmitDetect={ props.handlesubmitDetect }
                  />

                  {
                    props.isLoading && <div className="loading-wrapper">
                      <Loading />
                    </div>
                  }
                </div>
              }
            })()}
          </div>
        </div>
      )}
    </Transition>
  )
}
