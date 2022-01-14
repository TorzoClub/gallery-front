import React from 'react'
import { Transition } from 'react-transition-group'

const duration = 300

export default (props) => {
  const { appendStyle = {}, children, in: inProp } = props

  return (
    <Transition in={inProp} timeout={duration}>
      {state => (
        <div className={`fade ${state}`} style={{ ...appendStyle }}>
          { children }

          <style jsx>{`
            @keyframes cFadeIn {
              from {
                opacity: 0
              }

              to {
                opacity: 1
              }
            }

            @keyframes cFadeOut {
              from {
                opacity: 1
              }

              to {
                opacity: 0
              }
            }

            .fade {
              animation-timing-function: ease-in-out;
            }

            .fade.entering {
              animation-name: cFadeIn;
              animation-duration: ${duration}ms;
            }
            .fade.entered {}
            .fade.exiting {
              animation-name: cFadeOut;
              animation-duration: ${duration}ms;
            }
            .fade.exited {
              display: none;
            }
          `}</style>
        </div>
      )}
    </Transition>
  )
}
